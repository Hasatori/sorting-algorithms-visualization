import {Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Square} from './square';
import {tick} from '@angular/core/testing';
import {Swap} from './swap';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy {
  @Input() canvasSize: number;
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  squares: Square[] = [];
  private counter = 0;
  moveTop: Square[] = [];
  moveBottom: Square[] = [];
  moveLeft: Square[] = [];
  moveRight: Square[] = [];
  swapAnimation: Swap = null;

  constructor(private ngZone: NgZone) {
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.fillStyle = 'red';
    this.ngZone.runOutsideAngular(() => {
      this.tick();

    });
    setInterval(() => {
      this.tick();
    }, 40);
  }

  tick() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (this.swapAnimation !== null) {
      this.swapAnimation.animate();
    }
    this.squares.forEach(square => square.draw());
    this.requestId = requestAnimationFrame(() => this.tick);
  }

  play() {
    for (let i = 0; i < 15; i++) {
      const square = new Square(this.ctx, this.counter, i, 8);
      this.counter++;
      this.squares = this.squares.concat(square);
    }

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
}
