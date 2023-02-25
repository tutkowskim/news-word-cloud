import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import skipWords from './skipWords.json';
import { Article, WordCount } from "./types";
import axios from "axios";

const buildNewsApi = (apiKey: string, term: string, from: string) => `https://newsapi.org/v2/everything?from=${from}&sortBy=popularity&apiKey=${apiKey}&q=${encodeURIComponent(term)}`;

const getWords = (article: Article): string[] => {
    return (article.title + ' ' + article.description)
        .toLowerCase()
        .trim()
        .replace("'s", '')
        .replace(/[.,\/#!$%\^&\*;:{}=\\-_`~()…\+\[\]]\"/g, '')
        .split(/\s+/)
        .filter(word => !skipWords.includes(word));
}

const countWordsInArticles = (articles: Article[]): WordCount[] => {
    const map: Map<string, WordCount> = new Map<string, WordCount>();
    articles.forEach((article, index) => {
        const words = getWords(article);
        words.forEach(word => {
            if (map.has(word)) {
                map.get(word)!.count += 1;
                map.get(word)!.articles.push(index);
            } else {
                map.set(word, { word, count: 1, articles: [index] });
            }
        });
    })

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const daysToInclude = 14;
    const fromDate: Date = new Date(new Date().getTime()-(daysToInclude*24*60*60*1000));
    const dateString = fromDate.toISOString().slice(0, 10);
    const apiKey: string = process.env.NEWS_API_KEY || '';
    const searchTerm = req.query.term;

    try {
        const res = await axios.get(buildNewsApi(apiKey, searchTerm, dateString));
        const articles: Article[] = res.data.articles;

        const wordCounts = countWordsInArticles(articles);
        const result = {
            articles: articles.map(article => ({ 
                url: article.url,
                urlToImage: article.urlToImage,
                title: article.title,
                description: article.description,
                publishedAt: article.publishedAt,
            })),
            wordCounts,
        };
        
        context.res = {
            body: JSON.stringify(result),
        };
    } catch (err) {
        context.res = {
            statsCode: 400,
            body: JSON.stringify({ error: err }),
        };
    }
};

export default httpTrigger;
