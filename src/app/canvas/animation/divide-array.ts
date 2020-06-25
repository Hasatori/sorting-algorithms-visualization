import {Square} from '../square';
import {Direction} from '../direction';

export class DivideArray {

  done = false;


  private left: Array<Square>;
  private right: Array<Square>;
  private finalY;
  private finalLeftX;
  private leftOnPlace = false;
  private rightOnPlace = false;
  private movementUnit = 0.1;
  private finalRightX: number;
  private animationStarted: boolean;

  constructor(left: Array<Square>, right: Array<Square>) {
    this.left = left;
    this.right = right;

  }

  animate() {
    if (!this.animationStarted) {
      this.finalY = this.left[0].y - 1;
      this.finalLeftX = this.left[0].x - Math.ceil(this.left.length / 2);
      this.finalRightX = this.right[this.right.length - 1].x + Math.ceil(this.right.length / 2);
      this.animationStarted = true;
    }
    if (!this.leftOnPlace) {
      let square;
      let horizontalLimit;
      let leftOnPlaceCandidate = true;
      for (let i = 0; i < this.left.length; i++) {
        square = this.left[i];
        horizontalLimit = this.finalLeftX + i;
        if (square.y > this.finalY) {
          square.move(Direction.TOP, this.movementUnit);
          leftOnPlaceCandidate = leftOnPlaceCandidate && false;
        } else if (square.x - this.movementUnit >= horizontalLimit) {
          square.move(Direction.LEFT, this.movementUnit);
          leftOnPlaceCandidate = leftOnPlaceCandidate && false;
        } else {
          square.x = horizontalLimit;
          square.y = this.finalY;
          leftOnPlaceCandidate = leftOnPlaceCandidate && true;
        }
      }
      this.leftOnPlace = leftOnPlaceCandidate;
    }
    if (!this.rightOnPlace) {
      let square;
      let horizontalLimit;
      let rightOnPlaceCandidate = true;
      for (let i = 0; i < this.right.length; i++) {
        square = this.right[i];
        horizontalLimit = this.finalRightX + i;
        if (square.y > this.finalY) {
          square.move(Direction.TOP, this.movementUnit);
          rightOnPlaceCandidate = rightOnPlaceCandidate && false;
        } else if (square.x + this.movementUnit <= horizontalLimit) {
          square.move(Direction.RIGHT, this.movementUnit);
          rightOnPlaceCandidate = rightOnPlaceCandidate && false;
        } else {
          square.x = horizontalLimit;
          square.y = this.finalY;
          rightOnPlaceCandidate = rightOnPlaceCandidate && true;
        }
      }
      this.rightOnPlace = rightOnPlaceCandidate;
    }
    this.done = this.leftOnPlace && this.rightOnPlace;
  }

}
