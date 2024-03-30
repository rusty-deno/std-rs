import { Fn } from '../../types.ts';
import { Vec } from '../vec/mod.ts';
import { Option,Some } from "../../error/option/option.ts";



export abstract class IteratorTrait<T> implements Iterable<T> {
  public abstract [Symbol.iterator](): Iterator<T>;

  public next() {
    return new Option(this[Symbol.iterator]().next().value as T|null);
  }

  public all(f: Fn<[element: T],boolean>) {
    for(const iter of this) if(!f(iter)) return false;

    return true;
  }

  public any(f: Fn<[element: T],boolean>) {
    for(const iter of this) if(f(iter)) return true;

    return false;
  }

  public fold<U>(init: U,f: Fn<[prev: U,element: T],U>) {
    for(const iter of this) init=f(init,iter);
    
    return init;
  }

  public forEach(f: Fn<[element: T,index: number],void>) {
    let i=0;
    for(const iter of this) f(iter,i++);
  }

  public abstract iter(): IterTrait<T>;

  public reduce(f: Fn<[prev: T,current: T],T>): Option<T> {
    const first=this.next();
    if(first.value==null) return first;

    return Some(this.fold(first.value,f));
  }

  public toArray() {
    return Array.from(this);
  }
  
  public toVec() {
    return Vec.from(this);
  }
}




export interface IterTrait<T> extends IteratorTrait<T> {
  chain(other: Iterable<T>): IterTrait<T>;
  cycle(): IterTrait<T>;
  enumerate(): IterTrait<T>;
  filter(f: Fn<[element: T],boolean>): IterTrait<T>;
  find(f: Fn<[element: T],boolean>): Option<T>;
  findMap<U>(f: Fn<[element: T],Option<U>>): Option<T>;
  flatMap<U>(f: Fn<[element: T],Option<U>>): IterTrait<U>;
  // flatten<U>(): IterTrait<U>;
  inspect(f: Fn<[element: T],void>): IterTrait<T>;
  map<U>(f: Fn<[element: T,index: number],U>): IterTrait<U>;
  mapWhile<U>(f: Fn<[element: T,index: number],U>): IterTrait<U>;
  position(f: Fn<[element: T],boolean>): number;
  skip(skip: number): IterTrait<T>;
  skipWhile(f: Fn<[element: T],boolean>): IterTrait<T>;
  stepBy(step: number): IterTrait<T>;
  take(n: number): IterTrait<T>;
  takeWhile(f: Fn<[element: T],boolean>): IterTrait<T>;
  zip<U>(other: Iterable<U>): IterTrait<[T,U]>;
}



