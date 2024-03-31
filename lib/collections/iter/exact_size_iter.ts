import { Option } from "../../error/option/mod.ts";
import { Fn } from "../../types.ts";
import { Vec } from "../vec/mod.ts";
import { IteratorTrait } from "./iter.ts";

export abstract class ExactSizeIterator<T> implements IteratorTrait<T> {
  public abstract join(seperator: string): string;

  public abstract chain(other: Iterable<T>): IteratorTrait<T>;
  public abstract cycle(): IteratorTrait<T>;
  public abstract enumerate(): IteratorTrait<T>;
  public abstract filter(f: Fn<[element: T], boolean>): IteratorTrait<T>;
  public abstract find(f: Fn<[element: T], boolean>): Option<T>;
  public abstract findMap<U>(f: Fn<[element: T], Option<U>>): Option<T>;
  public abstract flatMap<U>(f: Fn<[element: T], Option<U>>): IteratorTrait<U>;
  // deno-lint-ignore no-explicit-any
  public abstract flatten<U>(): IteratorTrait<T extends Iterable<any> ? U : T>;
  public abstract inspect(f: Fn<[element: T], void>): IteratorTrait<T>;
  public abstract map<U>(f: Fn<[element: T, index: number], U>): IteratorTrait<U>;
  public abstract mapWhile<U>(f: Fn<[element: T, index: number], U>): IteratorTrait<U>;
  public abstract position(f: Fn<[element: T], boolean>): number;
  public abstract skip(skip: number): IteratorTrait<T>;
  public abstract skipWhile(f: Fn<[element: T], boolean>): IteratorTrait<T>;
  public abstract stepBy(step: number): IteratorTrait<T>;
  public abstract take(n: number): IteratorTrait<T>;
  public abstract takeWhile(f: Fn<[element: T], boolean>): IteratorTrait<T>;
  public abstract zip<U>(other: Iterable<U>): IteratorTrait<[T, U]>;
  public abstract next(): Option<T>;
  public abstract all(f: Fn<[element: T], boolean>): boolean;
  public abstract any(f: Fn<[element: T], boolean>): boolean;
  public abstract fold<U>(init: U, f: Fn<[prev: U, element: T], U>): U;
  public abstract forEach(f: Fn<[element: T, index: number], void>): void;
  public abstract iter(): IteratorTrait<T>;
  public abstract reduce(f: Fn<[prev: T, current: T], T>): Option<T>;
  public abstract toArray(): T[];
  public abstract toVec(): Vec<T>;
  public abstract [Symbol.iterator](): Iterator<T>;

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


