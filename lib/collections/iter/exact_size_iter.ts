import { IterTrait } from "./iter.ts";

export abstract class ExactSizeIterator<T> extends IterTrait<T> {
  public abstract len(): number;

  public isEmpty() {
    return this.len()===0;
  }
}


