import {Square} from '../square';
import {Direction} from '../direction';
import {Swap} from './swap';
import {MoveToPosition} from './move-to-position';

export class MergeArray {
  private left: Array<Square>;
  private right: Array<Square>;
  private swaps: Array<MoveToPosition>;
  private finalLeftX: number;
  private finalRightX: number;
  private leftHorizontallyOnPlace = false;
  private leftVerticallyOnPlace = false;
  private rightHorizontallyOnPlace = false;
  private rightVerticallyOnPlace = false;
  private finalY: number;
  private movementUnit = 0.1;
  done = false;
  private animationStarted = false;

  constructor(left: Array<Square>, right: Array<Square>, swaps: Array<MoveToPosition>) {
    this.left = left;
    this.right = right;
    this.swaps = swaps;

  }

  animate() {
    if (!this.animationStarted) {
      this.finalRightX = this.finalRightX = this.left.reduce((max, p) => p.x > max ? p.x : max, this.left[0].x) + 1;
      this.finalY = this.right[0].y + 1;
      this.animationStarted = true;
      console.log(this.left);
      console.log(this.right);
      console.log(this.finalRightX);
      console.log(this.swaps);
      if (this.right.length === 0) {
        this.rightVerticallyOnPlace = true;
        this.rightHorizontallyOnPlace = true;
      }
    }
    if (!this.rightHorizontallyOnPlace) {
      let square;
      let horizontalLimit;
      let rightOnPlaceCandidate = true;
      for (let i = 0; i < this.right.length; i++) {
        square = this.right[i];
        horizontalLimit = this.finalRightX + i;
        if (square.x - this.movementUnit >= horizontalLimit) {
          square.move(Direction.LEFT, this.movementUnit);
          rightOnPlaceCandidate = rightOnPlaceCandidate && false;
        } else {
          square.x = horizontalLimit;
          rightOnPlaceCandidate = rightOnPlaceCandidate && true;
        }
      }
      this.rightHorizontallyOnPlace = rightOnPlaceCandidate;
    }

    if (this.rightHorizontallyOnPlace) {
      if (this.swaps.some(swap => !swap.done)) {
        this.swaps.find(swap => !swap.done).animate();
      } else {
        if (!this.leftVerticallyOnPlace) {
          let square;
          let leftOnPlaceCandidate = true;
          for (let i = 0; i < this.left.length; i++) {
            square = this.left[i];
            if (square.y < this.finalY) {
              square.move(Direction.BOTTOM, this.movementUnit);
              leftOnPlaceCandidate = leftOnPlaceCandidate && false;
            } else {
              square.y = this.finalY;
              leftOnPlaceCandidate = leftOnPlaceCandidate && true;
            }
          }
          this.leftVerticallyOnPlace = leftOnPlaceCandidate;
        }
        if (!this.rightVerticallyOnPlace) {
          let square;
          let rightOnPlaceCandidate = true;
          for (let i = 0; i < this.right.length; i++) {
            square = this.right[i];
            if (square.y < this.finalY) {
              square.move(Direction.BOTTOM, this.movementUnit);
              rightOnPlaceCandidate = rightOnPlaceCandidate && false;
            } else {
              square.y = this.finalY;
              rightOnPlaceCandidate = rightOnPlaceCandidate && true;
            }
          }
          this.rightVerticallyOnPlace = rightOnPlaceCandidate;
        }

      }
    }
    this.done = this.leftVerticallyOnPlace && this.rightVerticallyOnPlace;
  }
}
