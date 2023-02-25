export interface Article {
  source: {
      id: any,
      name: string;
  },
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface WordCount {
  word: string;
  count: number;
  articles: number[];
}
