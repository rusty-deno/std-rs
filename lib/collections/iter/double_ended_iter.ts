import { Option } from '../../error/option/option.ts';
import { ExactSizeIterator } from './exact_size_iter.ts';

export abstract class DoubleEndedIterator<T> extends ExactSizeIterator<T> {
  public abstract nextBack(): Option<T>;
  
  public nthBack(n: number) {
    for(let i=Math.abs(n);;i--) {
      if(i==0) return new Option(this.nextBack().value);
      this.nextBack();
    }
  }
}

