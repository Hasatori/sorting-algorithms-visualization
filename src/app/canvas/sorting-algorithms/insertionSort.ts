import {SortingAlgorithm} from './sorting-algorithm';
import {Square} from '../square';
import {Step} from '../step';
import {MoveToPosition} from '../animation/move-to-position';
import {Swap} from '../animation/swap';

export class InsertionSort implements SortingAlgorithm {
  done: boolean;
  private step: Step;
  private index = 1;
  private squares: Array<Square>;

  constructor(squares: Array<Square>) {
    this.squares = squares;
    this.step = this.createNextStep();
  }

  animate() {
    if (this.step.done) {
      this.step = this.createNextStep();
    }
    this.step.execute();
  }

  createNextStep(): Step {
    if (this.index === this.squares.length) {
      this.done = true;
    }
    let candidate = this.squares[this.index];
    let compared: Square = null;
    let lastSmaller: Square = null;
    for (let i = this.index - 1; i >= 0; i--) {

      compared = this.squares[i];
      if (candidate.numberValue >= compared.numberValue) {
        if (lastSmaller !== null) {
          compared = lastSmaller;
          break;
        }
        this.index++;
        if (this.index === this.squares.length) {
          compared = null;
          break;
        }
        candidate = this.squares[this.index];
        i = this.index - 1;
      } else {
        if (i === 0) {
          break;
        } else {
          lastSmaller = compared;
        }
      }
    }
    if (compared === null) {
      this.done = true;
    } else {
      let newArray: Array<Square>;
      const comparedIndex = this.squares.indexOf(compared);
      newArray = this.squares.filter(square => this.squares.indexOf(square) < comparedIndex);
      newArray.push(candidate);
      newArray = newArray.concat(this.squares.filter(square => {
          const curSquareIndex = this.squares.indexOf(square);
          return curSquareIndex >= comparedIndex && curSquareIndex !== this.index;
        }
      ));
      const squaresBetweenInclusive = this.squares.filter(square => {
          const curSquareIndex = this.squares.indexOf(square);
          return curSquareIndex >= comparedIndex && curSquareIndex < this.index;
        }
      );
      this.squares = newArray;
      return this.step = {
        done: false,
        execute() {
          if (this.moveToAnimation == null) {
            this.moveToAnimation = new MoveToPosition(candidate, compared, squaresBetweenInclusive);
          }
          if (!this.moveToAnimation.done) {
            this.moveToAnimation.animate();
          } else {
            this.done = true;
          }
        }

      };
    }


  }
}
