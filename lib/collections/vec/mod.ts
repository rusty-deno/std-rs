import { Clone } from '../../clone.ts';
import * as lib from "../../../bindings/std_rs.js";
import { Option } from "../../error/option/option.ts";

// TODO(kakashi): implement Drop trait using decorator
// TODO(kakashi): implement IterTrait
export class Vec<T> implements Iterable<T>,Clone {
  #ptr: number;

  constructor(...elements: T[]) {
    this.#ptr=elements.length>0?lib.vec_from_iter(elements):lib.new_vec();
  }

  public static withCapacity<T>(capacity: number) {
    return Vec.fromPtr(lib.new_vec_with_capacity(capacity));
  }

  public static from<T>(vec: T[]|Vec<T>) {
    return vec instanceof Vec?vec:new Vec(...vec);
  }

  public static fromIter<T>(iter: Iterable<T>) {
    return new Vec<T>(...iter);
  }

  private static fromPtr<T>(ptr: number) {
    const self=new Vec<T>();

    lib.drop_vec(self.#ptr);
    self.#ptr=ptr;

    return self;
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

  public clone() {
    const clone=Vec.withCapacity<T>(this.capacity);
    for(let i=0;i<this.length;i++) this.push(structuredClone(lib.vec_index(this.#ptr,i)));

    return clone;
  }

  public splice(start: number,end: number,replaceWith: Iterable<T>) {
    return Vec.fromPtr<T>(lib.vec_splice(this.#ptr,start,end,Array.from(replaceWith)));
  }

  public splitOff(at: number) {
    return Vec.fromPtr<T>(lib.vec_split_off(this.#ptr,at));
  }

  public append(other: T[]|Vec<T>) {
    lib.vec_append(this.#ptr,Vec.from(other).#ptr);
  }

  public empty() {
    lib.vec_empty(this.#ptr);
  }

  public insert(index: number,element: T) {
    lib.vec_insert(this.#ptr,index,element);
  }

  public remove(index: number) {
    lib.vec_remove(this.#ptr,index);
  }

  public shrinkTo(minCapacity: number) {
    lib.vec_shrink_to(this.#ptr,minCapacity);
  }

  public swap(start: number,end: number) {
    lib.vec_swap(this.#ptr,start,end);
  }

  public swapRemove(index: number) {
    lib.vec_swap_remove(this.#ptr,index);
  }
}



