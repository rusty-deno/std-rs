import { Option } from "../error/option/mod.ts";
import { IteratorTrait } from "./iter.ts";

export abstract class ExactSizeIterator<T> extends IteratorTrait<T> {
  public abstract len(): number;
  public abstract at(index: number): Option<T>;

  public count(): number {
    return this.len();
  }

  public last(): Option<T> {
    return this.at(this.len()-1);
  }

  public isEmpty() {
    return this.len()===0;
  }
}


