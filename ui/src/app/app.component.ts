import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, firstValueFrom } from 'rxjs';
import { News, NewsService } from './news.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public news: News|null = null;
  private _term: BehaviorSubject<string> = new BehaviorSubject<string>('tech');
  
  public get term(): string{
    return this._term.value;
  }

  public set term(value: string) {
    this._term.next(value);
  }

  constructor(private newsService: NewsService) {}

  public ngOnInit(): void {
    this._term.pipe(debounceTime(750)).subscribe(term => {
      this.news = null;
      firstValueFrom(this.newsService.getNews(term)).then(news => this.news = news);
    });
  }
}
