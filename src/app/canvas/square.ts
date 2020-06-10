import {NgZone} from '@angular/core';
import {Direction} from './direction';

export class Square {
  private color = 'black';
  x;
  y;
  private z = 50;
  numberValue: number;

  constructor(private ctx: CanvasRenderingContext2D, numberValue: number, x: number, y: number) {
    this.y = y;
    this.x = x;
    this.numberValue = numberValue;
    this.draw();
  }

  move(direction: Direction, by: number) {
    switch (direction) {
      case Direction.BOTTOM:
        this.y += by;
        break;
      case Direction.LEFT:
        this.x -= by;
        break;
      case Direction.RIGHT:
        this.x += by;
        break;
      case Direction.TOP:
        this.y -= by;
        break;
    }
  }


  public draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.fillStyle = '#FF0000';
    this.ctx.fillRect(this.z * this.x, this.z * this.y, this.z, this.z);
    this.ctx.font = '10px Georgia';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillText(this.numberValue.toString(), this.z * this.x + this.z / 2, this.z * this.y + this.z / 2);
    this.ctx.fillStyle = '#000000';
    this.ctx.stroke();
  }
}
