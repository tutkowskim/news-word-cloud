import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as cloud from 'd3-cloud';
import randomColor from 'randomcolor';
import { BehaviorSubject } from 'rxjs';
import { WordCount } from '../news.service';

@Component({
  selector: 'app-word-map',
  templateUrl: './word-map.component.html',
  styleUrls: ['./word-map.component.css']
})
export class WordMapComponent implements AfterViewInit {
  @ViewChild('wordCloud')
  public wordCloudRef: ElementRef | null = null;

  @Input()
  public set words(value: WordCount[]) {
    this._words.next(value);
  }
  public get words(): WordCount[] {
    return this._words.value;
  }
  private _words: BehaviorSubject<WordCount[]> = new BehaviorSubject<WordCount[]>([]);

  public ngAfterViewInit(): void {
    this._words.subscribe(() => this.redrawWordCloud());
  }

  @Output()
  public readonly selectedWord = new EventEmitter<string>();

  @HostListener('window:resize', ['$event'])
  public onResize(): void {
    this.redrawWordCloud();
  }

  private async redrawWordCloud(): Promise<void> {
    const height = this.wordCloudRef?.nativeElement?.offsetHeight;
    const width = this.wordCloudRef?.nativeElement?.offsetWidth;
    const fontFamily = "sans-serif";
    const fontScale = 15;
    const padding = 0;
    const rotate = () => 0;

    const wordCloudDiv = d3
      .select("#word-cloud");
    wordCloudDiv
      .select('svg')
      .remove();

    const svg = wordCloudDiv
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .attr("font-family", fontFamily)
      .attr("text-anchor", "middle");

    const w_cloud = cloud()
      .size([width, height])
      .words(this.words.map((d) => Object.create({ text: d.word, value: d.count })))
      .padding(padding)
      .rotate(rotate)
      .font(fontFamily)
      .fontSize((d: any) => Math.sqrt(d.value) * fontScale)
      .on("word", ({ size, x, y, rotate, text }) => {
        const textElement = svg
          .append("text")
          .attr("font-size", size || 12)
          .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
          .attr("fill", randomColor())
          .attr("cursor", "pointer")
          .text(text || '');

        textElement
          .on('mouseover', function () { d3.select(this).attr('text-decoration', 'underline') })
          .on('mouseout', function () { d3.select(this).attr('text-decoration', 'inherit') })
          .on('click', () => { if (text) this.selectedWord.next(text) });
      });

    w_cloud.start();
  }
}
