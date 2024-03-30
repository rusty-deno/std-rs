import { Fn } from '../../types.ts';
import { Vec } from '../vec/mod.ts';
import { Option,Some,None } from "../../error/option/option.ts";


/**
 * A trait for dealing with iterators.
 * 
 * This is the main iterator trait.
 * 
 * * Implementing it only requires two methods {@linkcode Symbol.iterator} and {@linkcode iter}.
 */
export abstract class IteratorTrait<T> implements Iterable<T> {
  /**
   * A method that returns the reversed iterator for an object.
   * 
   * It's often implemented double-ended iterators.
   */
  public static readonly reversedIter: unique symbol=Symbol.for("reversed_iter");
  public abstract [Symbol.iterator](): Iterator<T>;

  /**
   * 
   * Advances the iterator and returns the next value.
   * 
   * Returns None when iteration is finished.
   * Individual iterator implementations may choose to resume iteration, and so calling {@linkcode next} again may or may not eventually start returning {@linkcode Some(T)} again at some point.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  import { $vec } from "std";

  const vec = $vec(1, 2, 3);
  const iter = vec.iter();
  
  // A call to next() returns the next value...
  $assertEq(Some(1), iter.next());
  $assertEq(Some(2), iter.next());
  $assertEq(Some(3), iter.next());
  
  // ... and then None once it's over.
  $assertEq(None(),iter.next());
  
  // More calls may or may not return `None`. Here, they always will.
  $assertEq(None(), iter.next());
  $assertEq(None(), iter.next());
  ```
   */
  public next() {
    return new Option(this[Symbol.iterator]().next().value as T|null);
  }

  /**
   * Tests if every element of the iterator matches a predicate.
   * 
   * {@linkcode all} takes a function that returns `true` or `false`.
   * It applies this function to each element of the iterator, and if they all return `true`, then so does {@linkcode all}.
   * If any of them return `false`, it returns false.
   * 
   * {@linkcode all} is short-circuiting;
   * in other words, it will stop processing as soon as it finds a false, given that no matter what else happens, the result will also be `false`.
   * 
   * * An empty iterator returns `true`.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  import { $vec,$assert } from "std";
  
  const vec = $vec(1, 2, 3);

  $assert(a.iter().all( x => x > 0));
  $assert(!a.iter().all( x => x > 2));
  ```
   */
  public all(f: Fn<[element: T],boolean>) {
    for(const iter of this) if(!f(iter)) return false;

    return true;
  }

  /**
   * Tests if any element of the iterator matches a predicate.
   * 
   * {@linkcode any} takes a function that returns `true` or `false`.
   * It applies this function to each element of the iterator, and if any of them return `true`, then so does {@linkcode any}.
   * If they all return false, it returns `false`.
   * 
   * {@linkcode any} is short-circuiting;
   * in other words, it will stop processing as soon as it finds a `true`, given that no matter what else happens, the result will also be `true`.
   * 
   * * An empty iterator returns false.
   * ### Examples
   * Basic usage:
  ```ts
  import { $vec,$assert } from "std";
  
  const vec = $vec(1, 2, 70, 69, 0);

  $assert(a.iter().any( x => x > 69));
  $assert(!a.iter().any( x => x > 0));
  ```
   */
  public any(f: Fn<[element: T],boolean>) {
    for(const iter of this) if(f(iter)) return true;

    return false;
  }
  

  /**
   * Consumes the iterator, counting the number of iterations and returning it.
   * 
   * This method will iterate overt the iter until it's consumed, returning the number of times it iterated.
   * 
   * ### Panics
   * This function might have undefined behavior if the iterator has ever overflows 64-bit.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  import { $vec } from "std";

  const vec = $vec(1, 2, 3);

  $assertEq(a.iter().count(), 3);
  ```
   */
  public count() {
    return this.fold(0,count=> count+1);
  }

  /**
   * Folds every element into an accumulator by applying an operation, returning the final result.
   * 
   * {@linkcode fold} takes two arguments: an initial value, and a function with two arguments: an 'accumulator', and an element.
   * The function returns the value that the accumulator should have for the next iteration.
   * 
   * The initial value is the value the accumulator will have on the first call.
   * 
   * After applying this function to every element of the iterator, {@linkcode fold} returns the accumulator.
   * 
   * This operation is sometimes called 'reduce' or 'inject'.
   * 
   * Folding is useful whenever you have a collection of something, and want to produce a single value from it.
   * 
   * * **Note**: [reduce] can be used to use the first element as the initial value, if the accumulator type and item type is the same.
   * * **Note**: {@linkcode fold} combines elements in a left-associative fashion. For associative operators like +, the order the elements are combined in is not important, but for non-associative operators like - the order will affect the final result. For a right-associative version of {@linkcode fold}, see DoubleEndedIterator::rfold.
   * 
   * ### Note to Implementors
   * Several of the other (forward) methods have default implementations in terms of this one, so try to implement this explicitly if it can do something better than the default for loop implementation.
   * 
   * In particular, try to have this call {@linkcode fold} on the internal parts from which this iterator is composed.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  import { $vec } from "std";

  const vec = $vec(1, 2, 3);
  
  // the sum of all of the elements of the array
  const sum = a.iter().fold(0, (prev,x)=>  acc + x);
  
  $assertEq(sum, 6);
  ```
   */
  public fold<U>(init: U,f: Fn<[prev: U,element: T],U>) {
    for(const iter of this) init=f(init,iter);

    return init;
  }

  /**
   * Calls a function on each element of an iterator.
   * 
   * This is equivalent to using a for loop on the iterator, although break and continue are not possible from a function.
   * It's generally more idiomatic to use a for loop, but {@linkcode forEach} may be more legible when processing items at the end of longer iterator chains.
   * In some cases for_each may also be faster than a loop, because it will use internal iteration on adapters like `Chain`.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  import { $vec } from "std";

  $vec(0,1,2,3,4,5,69,13)
  .filter(x => x % 2===1)
  .forEach(console.log);
  ```
   */
  public forEach(f: Fn<[element: T,index: number],void>) {
    let i=0;
    for(const iter of this) f(iter,i++);
  }

  /**
   * Creates an iterator from a value.
   * 
   * ### Example
  ```ts
  import { $vec } from "std";

  const vec = $vec(0,1,2,3,4,5,69,13);
  const iter = vec.iter();

  $assertEq(Some(2),iter.next());
  $assertEq(Some(3),iter.next());
  $assertEq(Some(1),iter.next());
  $assertEq(None,iter.next());
  ```
   */
  public abstract iter(): IterTrait<T>;

  /**
   * Consumes the iterator, returning the last element.
   * 
   * This method will evaluate the iterator until it's consumed.
   * While doing so, it keeps track of the current element.
   * After the iterator is returned, {@linkcode last} will then return the last element it saw.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  import { $vec } from "std";

  const iter = $vec(0,1,2,3,4,5,69);

  $assertEq(Some(69),iter.last());
  ```
   */
  public last() {
    return this.fold(None<T>(),(_,xd)=> Some(xd));
  }

  /**
   * Reduces the elements to a single one, by repeatedly applying a reducing operation.
   * 
   * If the iterator is empty, returns `None`;
   * otherwise, returns the result of the reduction.
   * 
   * The reducing function accepts two arguments: an {@linkcode accumulator}, and an {@linkcode element}.
   * For iterators with at least one element, this is the same as {@linkcode fold} with the first element of the iterator as the initial accumulator value, folding every subsequent element into it.
   * 
   * ### Example
  ```ts
  import { $range,$assertEq } from "std";

  const reduced = $range(1,10).reduce((acc, e)=>  acc + e).unwrap();
  $assertEq(reduced, 45);
  ```
   */
  public reduce(f: Fn<[prev: T,current: T],T>): Option<T> {
    const first=this.next();
    if(first.value==null) return first;

    return Some(this.fold(first.value,f));
  }
  
  /**
   * Copies `this` into a new {@linkcode Array<T>}.
   */
  public toArray() {
    return Array.from(this);
  }

  /**
   * Copies `this` into a new {@linkcode Vec}.
   * 
   * * **NOTE**: This is a creates a shallow-copy. If you want a deep-copy the use {@linkcode Vec.clone}
   */
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



