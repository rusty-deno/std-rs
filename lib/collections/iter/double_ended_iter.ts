import { $assert } from "../../declarative-macros/mod.ts";
import { Option } from '../../error/option/option.ts';
import { IterTrait } from './iter.ts';

export abstract class DoubleEndedIterator<T> extends IterTrait<T> {
  public abstract nextBack(): Option<T>;
  
  public nthBack(n: number) {
    $assert(n>=0,"Index out of bounds");
    for(let i=n;;i--) {
      if(i==0) return new Option(this.nextBack().value);
      this.nextBack();
    }
  }
}

