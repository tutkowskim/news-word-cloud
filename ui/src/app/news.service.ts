import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

export interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

export interface WordCount {
  word: string;
  count: number;
  articles: number[];
}

export interface News {
  articles: Article[];
  wordCounts: WordCount[];
}

export interface Error {
  error?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private http: HttpClient) { }

  public getNews(term: string): Observable<News|Error> {
    return this.http.get<News>(`/api/FetchNews?term=${encodeURIComponent(term)}`);
  }
}
