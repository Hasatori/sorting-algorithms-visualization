import {AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Square} from './square';
import {Swap} from './animation/swap';
import {SortingAlgorithm} from './sorting-algorithms/sorting-algorithm';
import {SortingAlgorithmsFactory} from './sorting-algorithms/sorting-algorithms-factory';
import {
  BUBBLE_SORT,
  BUBBLE_SORT_DESC,
  INSERTION_SORT, INSERTION_SORT_DESC,
  SELECTION_SORT,
  SELECTION_SORT_DESC
} from './sorting-algorithms/sorting-algorithm-names';
import {Observable} from 'rxjs';
import {Action} from '../action';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() numbers: Observable<Array<number>>;
  @Input() action: Observable<Action>;
  @Input() canvasSize: number;
  @Input() animationSpeed: Observable<number>;
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('logBody', {static: true}) logBody: ElementRef<HTMLDivElement>;
  @ViewChild('sortingAlgorithmSelect', {static: true}) sortingAlgorithmsSelect: ElementRef<HTMLSelectElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  executionInterval;
  private counter = 10;
  squares: Array<Square> = [];
  swapAnimation: Swap = null;

  sortingAlgorithm: SortingAlgorithm = null;
  paused = false;
  sortingAlgorithmsFactory = new SortingAlgorithmsFactory();
  speed: number;
  executionCounter: number = 0;
  exectiontTime: string = 0 + ' seconds';
  algorithmDescription: string;

  constructor(private ngZone: NgZone) {

  }

  ngOnInit() {

    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.fillStyle = 'red';
    this.ngZone.runOutsideAngular(() => {
      this.tick();
    });
    this.action.subscribe(action => {
      switch (action) {
        case Action.START:
          this.start();
          break;
        case Action.PAUSE:
          this.paused = true;
          clearInterval(this.interval);
          cancelAnimationFrame(this.requestId);
          clearInterval(this.executionInterval);
          break;
        case Action.STOP:
          this.stop();
          break;
        case Action.CONTINUE:
          this.interval = setInterval(() => {
            this.tick();
          }, this.speed);
          this.executionInterval = setInterval(() => {
            this.executionCounter = this.executionCounter + 1;
            this.exectiontTime = this.executionCounter + ' seconds';
          }, 1000);
          this.paused = false;
          break;

      }

    });
    this.numbers.subscribe(numbers => {
      this.paused = false;
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.squares = [];
      for (let i = 0; i < numbers.length; i++) {
        const square = new Square(this.ctx, numbers[i], i, 1.15);
        this.squares = this.squares.concat(square);
      }
    });
    this.animationSpeed.subscribe(speed => {
      this.speed = speed;
      clearInterval(this.interval);
      cancelAnimationFrame(this.requestId);
      if (this.sortingAlgorithm !== null && !this.paused) {
        this.interval = setInterval(() => {
          this.tick();
        }, speed);
      }
    });

  }

  tick() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (this.sortingAlgorithm != null && !this.paused) {
      if (!this.sortingAlgorithm.done) {
        this.sortingAlgorithm.animate();
      } else {
        clearInterval(this.executionInterval);
        clearInterval(this.interval);
        cancelAnimationFrame(this.requestId);
      }

    }
    this.squares.forEach(square => square.draw());
    this.requestId = requestAnimationFrame(() => this.tick);
  }


  ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }


  stop() {
    this.sortingAlgorithm = null;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.squares = [];
    clearInterval(this.interval);
    clearInterval(this.executionInterval);
    cancelAnimationFrame(this.requestId);
    this.executionCounter = 0;
  }

  start() {
    this.executionCounter = 0;
    this.interval = setInterval(() => {
      this.tick();
    }, this.speed);
    this.sortingAlgorithm = this.sortingAlgorithmsFactory
      .getSortingAlgorithm(this.sortingAlgorithmsSelect.nativeElement.value, this.squares);
    this.executionInterval = setInterval(() => {
      this.executionCounter = this.executionCounter + 1;
      this.exectiontTime = this.executionCounter + ' seconds';
      this.logBody.nativeElement.scrollTop = this.logBody.nativeElement.scrollHeight;
    }, 1000);
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

  algorithmSelected() {
    switch (this.sortingAlgorithmsSelect.nativeElement.value) {
      case BUBBLE_SORT:
        this.algorithmDescription = BUBBLE_SORT_DESC;
        break;
      case SELECTION_SORT:
        this.algorithmDescription = SELECTION_SORT_DESC;
        break;
      case INSERTION_SORT:
        this.algorithmDescription = INSERTION_SORT_DESC;
        break;
    }
  }

  ngAfterViewInit(): void {
    this.algorithmSelected();
  }
}

