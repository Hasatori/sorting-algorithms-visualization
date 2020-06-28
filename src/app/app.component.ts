import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate} from '@angular/animations';
import {Square} from './canvas/square';
import {Observable, of, Subscriber} from 'rxjs';
import {Action} from './action';
import {isUndefined} from 'util';
import {nullSafeIsEquivalent} from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('numberOfObjectsToSort', {static: true}) numberOfObjectsToSort: ElementRef<HTMLSelectElement>;
  @ViewChild('canvasSizeSelect', {static: true}) canvasSizeSelect: ElementRef<HTMLSelectElement>;
  @ViewChild('animationSpeedSelect', {static: true}) animationSpeedComponent: ElementRef<HTMLSelectElement>;

  canvases: Array<Canvas> = [];
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
  doneCanvases: Array<Canvas> = [];

  constructor() {
    this.data = new Observable((subscriber => {
      this.dataSubscribers.push(subscriber);
      setTimeout(() => {
        subscriber.next(this.numbers);
      }, 1);

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
    this.canvases.push(new Canvas());
  }

  startSorting() {
    this.canvases.forEach(canvas => {
      canvas.place = -1;
      canvas.executionTime = -1;
      canvas.done = false;
    });
    this.doneCanvases = [];
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
    this.doneCanvases = [];
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

  deleteCanvas(canvas: Canvas) {
    this.canvases = this.canvases.filter(candidate => candidate !== canvas);
  }

  done(canvas: Canvas, executionTime: number) {
    canvas.done = true;
    canvas.executionTime = executionTime;
    const lastDoneCanvas = this.doneCanvases[this.doneCanvases.length - 1];
    console.log(lastDoneCanvas);
    console.log(canvas);
    if (isUndefined(lastDoneCanvas)) {
      canvas.place = 1;
    } else if (canvas.executionTime === lastDoneCanvas.executionTime) {
      canvas.place = lastDoneCanvas.place;
    } else {
      canvas.place = lastDoneCanvas.place + 1;
    }
    this.doneCanvases.push(canvas);
    if (this.doneCanvases.length === this.canvases.length) {
      this.sortingStarted = false;
      this.sortingPaused = false;
      this.numbers = [];
    }
  }
}

export class Canvas {
  done = false;
  executionTime = -1;
  place = -1;
}
