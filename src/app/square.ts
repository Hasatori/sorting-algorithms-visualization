export class Square {
  private color = 'red';
  private x = 0;
  private readonly y;
  private z = 30;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.y =  9;

  }

  moveRight() {
    this.x++;
    this.draw();
  }

  private draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.z * this.x, this.z * this.y, this.z, this.z);
  }
}
