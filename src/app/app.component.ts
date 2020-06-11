import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate} from '@angular/animations';
import {Square} from './canvas/square';
import {Observable, of, Subscriber} from 'rxjs';
import {Action} from './action';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('numberOfObjectsToSort', {static: true}) numberOfObjectsToSort: ElementRef<HTMLSelectElement>;
  @ViewChild('canvasSizeSelect', {static: true}) canvasSizeSelect: ElementRef<HTMLSelectElement>;
  @ViewChild('animationSpeedSelect', {static: true}) animationSpeedComponent: ElementRef<HTMLSelectElement>;

  canvases = [0];
  data: Observable<Array<number>>;
  dataSubscribers = [];
  actionSubscribers = [];
  action: Observable<Action>;
  numbers = [];
  canvasSize: number;
  animationSpeed: Observable<number>;
  animationSpeedSubscribers = [];

  sortingStarted = false;
  sortingPaused = false;

  constructor() {
    this.data = new Observable((subscriber => {
      this.dataSubscribers.push(subscriber);
      this.dataSubscribers.forEach(subscriber2 => {
        subscriber2.next(this.numbers);
      });
    }));
    this.action = new Observable((subscriber => {
      this.actionSubscribers.push(subscriber);
    }));
    this.animationSpeed = new Observable(subscriber => {
      this.animationSpeedSubscribers.push(subscriber);
      subscriber.next(Number(this.animationSpeedComponent.nativeElement.value));
    });

  }

  addCanvas() {
    this.canvases.push(this.canvases.length);
    console.log(this.canvases);
  }

  startSorting() {
    this.sortingStarted = true;
    this.actionSubscribers.forEach(subscriber => {
      subscriber.next(Action.START);
    });
  }

  pauseSorting() {
    this.sortingPaused = true;
    this.actionSubscribers.forEach(subscriber => {
      subscriber.next(Action.PAUSE);
    });
  }

  stopSorting() {
    this.sortingStarted = false;
    this.sortingPaused = false;
    this.numbers = [];
    this.actionSubscribers.forEach(subscriber => {
      subscriber.next(Action.STOP);
    });
  }

  continueSorting() {
    this.sortingPaused = false;
    this.actionSubscribers.forEach(subscriber => {
      subscriber.next(Action.CONTINUE);
    });
  }

  generateData(count: string) {
    const size = Number(count);
    this.numbers = [];
    for (let i = 0; i < size; i++) {
      this.numbers = this.numbers.concat(Math.floor(Math.random() * Math.floor(1000)));
    }
    this.dataSubscribers.forEach(subscriber => {
      subscriber.next(this.numbers);
    });
  }

  ngOnInit(): void {
    this.setCanvasSize();
  }

  setCanvasSize() {
    this.canvasSize = Number(this.canvasSizeSelect.nativeElement.value);
  }

  setAnimationSpeed() {

    this.animationSpeedSubscribers.forEach(subscriber => {
      subscriber.next(Number(this.animationSpeedComponent.nativeElement.value));
    });
  }

  deleteCanvas(value: number) {
    console.log(this.canvases);
    this.canvases = this.canvases.filter(canvas => canvas !== value);
    for (let i = 0; i < this.canvases.length; i++) {
      this.canvases[i] = i;
    }
  }
}
