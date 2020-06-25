import {LogStep} from './log-step';
import {Observable} from 'rxjs';

export interface SortingAlgorithm {

  done: boolean;
  steps: LogStep[];

  animate();


}
