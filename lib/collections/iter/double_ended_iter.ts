import { IntoIterator } from './iter.ts';
import { Option } from '../../error/option/option.ts';
import { ExactSizeIterator } from './exact_size_iter.ts';
import { Fn } from '../../types.ts';


export abstract class DoubleEndedIterator<T> extends ExactSizeIterator<T> {
  public abstract [IntoIterator.reversedIter](): Iterator<T>;
  public nextBack() {
    return new Option(this[IntoIterator.reversedIter]().next().value as T|null|undefined);
  }

  public nthBack(n: number) {
    for(let i=Math.abs(n);;i--) {
      if(i==0) return new Option(this.nextBack().value);
      this.nextBack();
    }
  }

  public abstract rev(): DoubleEndedIterator<T>;

  public rfind(f: Fn<[element: T],boolean>) {
    this.rev().find(f);
  }

  public rfold<U>(init: U,f: Fn<[prev: U,element: T],U>) {
    return this.rev().fold(init,f);
  }

  public rposition(f: Fn<[element: T],boolean>) {
    return this.rev().position(f);
  }
}


