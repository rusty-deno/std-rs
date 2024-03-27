import * as lib from "../../../bindings/std_rs.js";
import { Option } from "../../error/option/option.ts";

// TODO(kakashi): implement Drop trait using decorator
// TODO(kakashi): implement IterTrait
export class Vec<T> implements Iterable<T> {
  #ptr: number;

  constructor(...elements: T[]) {
    this.#ptr=elements.length>0?lib.vec_from_iter(elements):lib.new_vec();
  }

  public static withCapacity<T>(capacity: number) {
    const self=new Vec<T>();

    lib.drop_vec(self.#ptr);
    self.#ptr=lib.new_vec_with_capacity(capacity);

    return self;
  }

  public static fromIter<T>(iter: Iterable<T>) {
    return new Vec<T>(...iter);
  }

  public get length() {
    return lib.vec_len(this.#ptr);
  }
  
  public get capacity() {
    return lib.vec_capacity(this.#ptr);
  }

  *[Symbol.iterator](): Iterator<T> {
    for(let i=0;i<this.length;i++) yield lib.vec_index(this.#ptr,i);
  }

  public at(index: number) {
    return new Option(lib.vec_at(this.#ptr,index) as T|null);
  }

  public push(element: T) {
    lib.push(this.#ptr,element);
  }

  public pop() {
    return new Option(lib.pop(this.#ptr) as T|null);
  }
}



