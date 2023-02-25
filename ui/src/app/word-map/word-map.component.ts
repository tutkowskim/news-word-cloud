import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as cloud from 'd3-cloud';
import randomColor from 'randomcolor';

@Component({
  selector: 'app-word-map',
  templateUrl: './word-map.component.html',
  styleUrls: ['./word-map.component.css']
})
export class WordMapComponent implements AfterViewInit {
  @ViewChild('wordCloud') 
  public wordCloudRef: ElementRef|null = null;

  public readonly  data: {word: string, count: number}[] = [
    { word: 'Hi', count: 2*10 }, 
    { word: 'There', count: 5*10 },
    { word: 'My', count: 10*10 },
    { word: 'Friend', count: 3*10 },
  ]

  public ngAfterViewInit(): void {
    this.redrawWordCloud();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(): void {
    this.redrawWordCloud();
  }

  private redrawWordCloud(): void {
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
      .words(this.data.map((d) => Object.create({ text: d.word, value: d.count })))
      .padding(padding)
      .rotate(rotate)
      .font(fontFamily)
      .fontSize((d: any) => Math.sqrt(d.value) * fontScale)
      .on("word", ({ size, x, y, rotate, text }) => {
        svg
          .append("text")
          .attr("font-size", size || 12)
          .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
          .attr("fill", randomColor())
          .text(text || '');
      });

    w_cloud.start();
  }
}