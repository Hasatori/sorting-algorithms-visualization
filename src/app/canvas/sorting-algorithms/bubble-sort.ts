import {SortingAlgorithm} from './sorting-algorithm';
import {Square} from '../square';
import {Step} from '../step';
import {Swap} from '../swap';

export class BubbleSort implements SortingAlgorithm {

  private readonly squares: Array<Square>;
  step: Step;
  swapAnimation: Swap;
  done = false;
  index = 0;
  iterationRestared: boolean = false;

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

  private createNextStep(): Step {
    if (this.index + 2 >= this.squares.length + 1) {
      this.index = 0;
    }

    let first = this.squares[this.index];
    let toSwap = this.squares[this.index + 1];

    while (first.numberValue <= toSwap.numberValue) {
      this.index++;
      if (this.index + 2 >= this.squares.length + 1) {
        if (this.iterationRestared) {
          this.done = true;
          break;
        } else {
          this.index = 0;
          this.iterationRestared = true;
        }
      }
      first = this.squares[this.index];
      toSwap = this.squares[this.index + 1];
    }
    this.iterationRestared = false;
    this.squares[this.index] = toSwap;
    this.squares[this.index + 1] = first;
    this.index++;
    this.step = {
      done: false,
      execute() {
        if (this.swapAnimation == null) {
          this.swapAnimation = new Swap(first, toSwap);
        }
        if (!this.swapAnimation.done) {
          this.swapAnimation.animate();
        } else {
          this.done = true;
        }
      }
    };
    return this.step;
  }
}
