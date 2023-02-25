import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, firstValueFrom } from 'rxjs';
import { News, NewsService } from './news.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public news: News | null = null;
  public isLoading: boolean = false;
  public unableToLoadNews: boolean = false;
  private _term: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public get term(): string {
    return this._term.value;
  }

  public set term(value: string) {
    this._term.next(value);
  }

  constructor(private newsService: NewsService) { }

  public ngOnInit(): void {
    this._term.pipe(debounceTime(750)).subscribe(term => {
      this.news = null;
      this.unableToLoadNews = false;

      if (term) {
        this.isLoading = true;
        firstValueFrom(this.newsService.getNews(term)).then((news: any) => {
          if (news['articles'] && news['wordCounts']) {
            this.news = news as News;
          } else {
            this.unableToLoadNews = true;
          }
          this.isLoading = false;
        });
      }
    });
  }
}
