import {Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Square} from './square';

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
  private counter: number = 0;

  constructor(private ngZone: NgZone) {
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.fillStyle = 'red';
    this.ngZone.runOutsideAngular(() => this.tick());
    setInterval(() => {
      this.tick();
    }, 1);
  }

  tick() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.squares.forEach((square: Square) => {
      square.moveRight();
    });
    this.requestId = requestAnimationFrame(() => this.tick);
  }

  play() {
    const square = new Square(this.ctx, this.counter);
    this.counter++;
    this.squares = this.squares.concat(square);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }

}
