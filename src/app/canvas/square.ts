export class Square {
  private color = 'black';
  private x = 0;
  private readonly y;
  private z = 30;
  private numberValue: number;

  constructor(private ctx: CanvasRenderingContext2D, numberValue: number) {
    this.y = 9;
    this.numberValue = numberValue;

  }

  moveRight() {
    this.x += 0.01;
    this.draw();
  }

  private draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.font = '10px Georgia';
    this.ctx.fillText(this.numberValue.toString(), this.z * this.x + this.z / 2, this.z * this.y + this.z / 2);
    this.ctx.rect(this.z * this.x, this.z * this.y, this.z, this.z);
    this.ctx.shadowColor = '#aaaaaa';
    this.ctx.shadowBlur = 5;
    this.ctx.shadowOffsetX = 5;
    this.ctx.shadowOffsetY = 2;
    this.ctx.stroke();
  }
}
