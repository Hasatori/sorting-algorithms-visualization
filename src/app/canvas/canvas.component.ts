import {Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Square} from './square';
import {tick} from '@angular/core/testing';
import {Swap} from './swap';
import {SelectionSort} from './selection-sort';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy {
  @Input() canvasSize: number;
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('animationSpeed', {static: true}) animationSpeedComponent: ElementRef<HTMLSelectElement>;
  @ViewChild('numberOfObjectsToSort', {static: true}) numberOfObjectsToSort: ElementRef<HTMLSelectElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  squares: Square[] = [];
  private counter = 10;
  moveTop: Square[] = [];
  moveBottom: Square[] = [];
  moveLeft: Square[] = [];
  moveRight: Square[] = [];
  swapAnimation: Swap = null;
  animationSpeed: number;
  selectionSort: SelectionSort = null;
  stopped = false;

  constructor(private ngZone: NgZone) {

  }

  ngOnInit() {
    this.setAnimationSpeed();
    this.setCounter();
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.fillStyle = 'red';
    this.ngZone.runOutsideAngular(() => {
      this.tick();
    });

  }

  tick() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (this.selectionSort != null && !this.stopped) {
      if (!this.selectionSort.done) {
        this.selectionSort.nextStep().execute();
      }
    }
    this.squares.forEach(square => square.draw());
    this.requestId = requestAnimationFrame(() => this.tick);
  }

  play() {
    this.stopped = false;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.squares = [];
    for (let i = 0; i < this.counter; i++) {
      const square = new Square(this.ctx, Math.floor(Math.random() * Math.floor(1000)), i, 2);
      this.squares = this.squares.concat(square);
    }
    this.selectionSort = new SelectionSort(this.squares);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }


  swap() {
    let first = this.getRandomSquareElement();
    let seond = this.getRandomSquareElement();
    this.swapAnimation = new Swap(first, seond);
  }

  getRandomSquareElement(): Square {
    return this.squares[Math.floor(Math.random() * Math.floor(this.squares.length))];
  }

  setAnimationSpeed() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
    this.animationSpeed = Number(this.animationSpeedComponent.nativeElement.value);
    this.interval = setInterval(() => {
      this.tick();
    }, Number(this.animationSpeedComponent.nativeElement.value));
  }

  setCounter() {
    this.counter = Number(this.numberOfObjectsToSort.nativeElement.value);
  }

  stop() {
    this.selectionSort = null;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.squares = [];
  }
}
