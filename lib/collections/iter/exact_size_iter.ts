import { Option } from "../../error/option/mod.ts";
import { Fn } from "../../types.ts";
import { Vec } from "../vec/mod.ts";
import { IterTrait } from "./iter.ts";

export abstract class ExactSizeIterator<T> implements IterTrait<T> {
  public abstract chain(other: Iterable<T>): IterTrait<T>;
  public abstract cycle(): IterTrait<T>;
  public abstract enumerate(): IterTrait<T>;
  public abstract filter(f: Fn<[element: T], boolean>): IterTrait<T>;
  public abstract find(f: Fn<[element: T], boolean>): Option<T>;
  public abstract findMap<U>(f: Fn<[element: T], Option<U>>): Option<T>;
  public abstract flatMap<U>(f: Fn<[element: T], Option<U>>): IterTrait<U>;
  public abstract inspect(f: Fn<[element: T], void>): IterTrait<T>;
  public abstract map<U>(f: Fn<[element: T, index: number], U>): IterTrait<U>;
  public abstract mapWhile<U>(f: Fn<[element: T, index: number], U>): IterTrait<U>;
  public abstract position(f: Fn<[element: T], boolean>): number;
  public abstract skip(skip: number): IterTrait<T>;
  public abstract skipWhile(f: Fn<[element: T], boolean>): IterTrait<T>;
  public abstract stepBy(step: number): IterTrait<T>;
  public abstract take(n: number): IterTrait<T>;
  public abstract takeWhile(f: Fn<[element: T], boolean>): IterTrait<T>;
  public abstract zip<U>(other: Iterable<U>): IterTrait<[T, U]>;
  public abstract next(): Option<T>;
  public abstract all(f: Fn<[element: T], boolean>): boolean;
  public abstract any(f: Fn<[element: T], boolean>): boolean;
  public abstract fold<U>(init: U, f: Fn<[prev: U, element: T], U>): U;
  public abstract forEach(f: Fn<[element: T, index: number], void>): void;
  public abstract iter(): IterTrait<T>;
  public abstract reduce(f: Fn<[prev: T, current: T], T>): Option<T>;
  public abstract toArray(): T[];
  public abstract toVec(): Vec<T>;
  public abstract [Symbol.iterator](): Iterator<T>;

  public abstract len(): number;

  public isEmpty() {
    return this.len()===0;
  }
}


