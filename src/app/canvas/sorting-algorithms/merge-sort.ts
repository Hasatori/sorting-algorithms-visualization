import {SortingAlgorithm} from './sorting-algorithm';
import {Square} from '../square';
import {DivideArray} from '../animation/divide-array';
import {isUndefined} from 'util';
import {MergeArray} from '../animation/merge-array';
import {Swap} from '../animation/swap';
import {MoveToPosition} from '../animation/move-to-position';

export class MergeSort implements SortingAlgorithm {
  done: boolean;

  private dividingDone = false;
  private divideArrayAnimations: Map<number, DivideArray[]>;
  private mergeArrayAnimations: Map<number, MergeArray[]>;
  private dividedArrays: Array<Square[]> = [];
  private elementsCount: number;
  private animationIndex = 0;

  constructor(squares: Array<Square>) {
    this.divideArrayAnimations = new Map<number, DivideArray[]>();
    this.mergeArrayAnimations = new Map<number, MergeArray[]>();
    this.sort(squares, 0, squares.length - 1, 0);
    console.log(this.divideArrayAnimations);
    console.log(this.mergeArrayAnimations);
  }

  animate() {
    if (!this.dividingDone) {
      if (isUndefined(this.divideArrayAnimations.get(this.animationIndex))) {
        this.dividingDone = true;
      } else if (this.divideArrayAnimations.get(this.animationIndex).some(animation => animation.done === false)) {
        this.divideArrayAnimations.get(this.animationIndex).forEach(animation => animation.animate());
      } else {
        this.animationIndex++;
      }
    } else {
      console.log(this.animationIndex);
      if (isUndefined(this.mergeArrayAnimations.get(this.animationIndex))) {
        this.done = true;
      } else if (this.mergeArrayAnimations.get(this.animationIndex).some(animation => animation.done === false)) {
        this.mergeArrayAnimations.get(this.animationIndex).forEach(animation => animation.animate());
      } else {
        this.animationIndex--;
      }
    }
  }

  private merge(array: Array<Square>, leftIndex: number, rightIndex: number, middleIndex: number, level: number) {
    let left = array.filter(element => {
      const index = array.indexOf(element);
      return index >= leftIndex && index <= middleIndex;
    });
    let right = array.filter(element => {
      const index = array.indexOf(element);
      return index > middleIndex && index <= rightIndex;
    });
    const leftCopy: Array<Square> = Object.assign(left);
    const rightCopy: Array<Square> = Object.assign(right);
    const leftCopySize = leftCopy.length;
    const rightCopySize = rightCopy.length;
    let i = 0;
    let j = 0;
    let k = leftIndex;
    const swaps: Array<MoveToPosition> = [];
    while (i < leftCopySize && j < rightCopySize) {
      if (leftCopy[i].numberValue <= rightCopy[j].numberValue) {
        i++;
      } else {
        const alteredLeft = leftIndex + i;
        const alteredRight = rightIndex + j;
        const squaresBetween = array.filter(element => {
          const index = array.indexOf(element);
          return (index >= alteredLeft && index <= middleIndex) || (index > middleIndex && index <= alteredRight);
        });
        swaps.push(new MoveToPosition(right[j], left[i], squaresBetween));

        left = array.filter(element => {
          const index = array.indexOf(element);
          return index >= leftIndex && index <= middleIndex;
        });
        right = array.filter(element => {
          const index = array.indexOf(element);
          return index > middleIndex && index <= rightIndex;
        });
        let newArray: Array<Square>;
        newArray = array.filter(square => array.indexOf(square) < k);
        newArray.push(rightCopy[j]);
        newArray = newArray.concat(array.filter(square => {
            const curSquareIndex = array.indexOf(square);
            return curSquareIndex >= k && curSquareIndex !== alteredRight;
          }
        ));
        array = newArray;
        j++;
      }
      k++;
    }

    console.log(level);
    console.log(array.map(element => element.numberValue));
    console.log(swaps);
    const animation = new MergeArray(leftCopy, rightCopy, swaps);
    if (isUndefined(this.mergeArrayAnimations.get(level))) {
      this.mergeArrayAnimations.set(level, [animation]);
    } else {
      this.mergeArrayAnimations.get(level).push(animation);
    }
  }

  private sort(array: Square[], leftIndex: number, rightIndex: number, level: number) {
    if (leftIndex < rightIndex) {
      const middleIndex = Math.floor((leftIndex + rightIndex) / 2);
      const left = array.filter(element => {
        const index = array.indexOf(element);
        return index >= leftIndex && index <= middleIndex;
      });
      const right = array.filter(element => {
        const index = array.indexOf(element);
        return index > middleIndex && index <= rightIndex;
      });
      const animation = new DivideArray(left, right);
      if (isUndefined(this.divideArrayAnimations.get(level))) {
        this.divideArrayAnimations.set(level, [animation]);
      } else {
        this.divideArrayAnimations.get(level).push(animation);
      }

      const newLevel = ++level;
      this.sort(array, leftIndex, middleIndex, newLevel);
      this.sort(array, middleIndex + 1, rightIndex, newLevel);

      this.merge(array, leftIndex, rightIndex, middleIndex, level);
    }
  }
}

class Pair {
  public readonly right: Array<Square>;
  public readonly left: Array<Square>;

  constructor(left: Array<Square>, right: Array<Square>) {
    this.left = left;
    this.right = right;
  }
}
