import {Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Square} from './square';
import {Swap} from './animation/swap';
import {SortingAlgorithm} from './sorting-algorithms/sorting-algorithm';
import {SortingAlgorithmsFactory} from './sorting-algorithms/sorting-algorithms-factory';
import {BUBBLE_SORT, INSERTION_SORT, SELECTION_SORT} from './sorting-algorithms/sorting-algorithm-names';

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
  @ViewChild('sortingAlgorithmSelect', {static: true}) sortingAlgorithmsSelect: ElementRef<HTMLSelectElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  squares: Square[] = [];
  private counter = 10;
  swapAnimation: Swap = null;
  animationSpeed: number;
  sortingAlgorithm: SortingAlgorithm = null;
  stopped = false;
  sortingAlgorithmsFactory = new SortingAlgorithmsFactory();

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
    if (this.sortingAlgorithm != null && !this.stopped) {
      if (!this.sortingAlgorithm.done) {
        this.sortingAlgorithm.animate();
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

    this.sortingAlgorithm = this.sortingAlgorithmsFactory.getSortingAlgorithm(this.sortingAlgorithmsSelect.nativeElement.value, this.squares);

  }

  ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
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
    this.sortingAlgorithm = null;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.squares = [];
  }

  bubbleSortName(): string {
    return BUBBLE_SORT;
  }

  selectionSortName(): string {
    return SELECTION_SORT;
  }

  insertionSortName(): string {
    return INSERTION_SORT;
  }
}
