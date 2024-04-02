import { Fn } from '../../types.ts';
import { Vec } from '../vec/mod.ts';
import { Option,Some,None,Optional } from "../../error/option/option.ts";
import { $unimplemented } from "../../declarative-macros/panics.ts";



/**
 * A trait for dealing with iterators.
 * 
 * * Implementing it only requires two methods {@linkcode Symbol.iterator} and {@linkcode iter}.
 */
export abstract class IntoIterator<T> implements Iterable<T> {
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
   * Returns `None` when iteration is finished.
   * Individual iterator implementations may choose to resume iteration, and so calling {@linkcode next()} again may or may not eventually start returning {@linkcode Some(T)} again at some point.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  const vec = $vec(1, 2, 3);
  const iter = vec.iter();
  
  // A call to next() returns the next value...
  $assertEq(1, iter.next());
  $assertEq(2, iter.next());
  $assertEq(3, iter.next());
  
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
   * {@linkcode all()} takes a callback function that returns `true` or `false`.
   * It applies this callback to each element of the iterator, and if they all return `true`, then so does {@linkcode all()}.
   * If any of them return `false`, it returns false.
   * 
   * {@linkcode all()} is short-circuiting;
   * in other words, it will stop processing as soon as it finds a false, given that no matter what else happens, the result will also be `false`.
   * 
   * * An empty iterator returns `true`.
   * 
   * ### Examples
   * Basic usage:
  ```ts
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
   * {@linkcode any()} takes a callback function that returns `true` or `false`.
   * It applies this callback to each element of the iterator, and if any of them return `true`, then so does {@linkcode any()}.
   * If they all return false, it returns `false`.
   * 
   * {@linkcode any()} is short-circuiting;
   * in other words, it will stop processing as soon as it finds a `true`, given that no matter what else happens, the result will also be `true`.
   * 
   * * An empty iterator returns false.
   * ### Examples
   * Basic usage:
  ```ts
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
   * {@linkcode fold()} takes two arguments: an initial value, and a callback function with two arguments: an 'accumulator', and an element.
   * The function returns the value that the accumulator should have for the next iteration.
   * 
   * The initial value is the value the accumulator will have on the first call.
   * 
   * After applying this callback to every element of the iterator, {@linkcode fold()} returns the accumulator.
   * 
   * This operation is sometimes called 'reduce' or 'inject'.
   * 
   * Folding is useful whenever you have a collection of something, and want to produce a single value from it.
   * 
   * * **Note**: [reduce] can be used to use the first element as the initial value, if the accumulator type and item type is the same.
   * * **Note**: {@linkcode fold()} combines elements in a left-associative fashion. For associative operators like +, the order the elements are combined in is not important, but for non-associative operators like - the order will affect the final result. For a right-associative version of {@linkcode fold()}, see DoubleEndedIterator::rfold.
   * 
   * ### Note to Implementors
   * Several of the other (forward) methods have default implementations in terms of this one, so try to implement this explicitly if it can do something better than the default for loop implementation.
   * 
   * In particular, try to have this call {@linkcode fold()} on the internal parts from which this iterator is composed.
   * 
   * ### Examples
   * Basic usage:
  ```ts
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
   * Calls a callback function on each element of an iterator.
   * 
   * This is equivalent to using a for loop on the iterator, although break and continue are not possible from a callback.
   * It's generally more idiomatic to use a for loop, but {@linkcode forEach()} may be more legible when processing items at the end of longer iterator chains.
   * In some cases for_each may also be faster than a loop, because it will use internal iteration on adapters like `Chain`.
   * 
   * ### Examples
   * Basic usage:
  ```ts
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
  const vec = $vec(0,1,2);
  const iter = vec.iter();

  $assertEq(0,iter.next());
  $assertEq(1,iter.next());
  $assertEq(2,iter.next());
  $assertEq(None(),iter.next());
  ```
   */
  public abstract iter(): IteratorTrait<T>;

  /**
   * Consumes the iterator, returning the last element.
   * 
   * This method will evaluate the iterator until it's consumed.
   * While doing so, it keeps track of the current element.
   * After the iterator is returned, {@linkcode last()} will then return the last element it saw.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  const iter = $vec(0,1,2,3,4,5,69);

  $assertEq(69,iter.last());
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
   * The reducing callback accepts two arguments: an {@linkcode accumulator}, and an {@linkcode element}.
   * For iterators with at least one element, this is the same as {@linkcode fold()} with the first element of the iterator as the initial accumulator value, folding every subsequent element into it.
   * 
   * ### Example
  ```ts
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
   * Joins an iterator with a copy of separator between adjacent items of the iterator.
   * 
   * 
   * ### Example
   * Basic usage:
  ```ts
  const hello = $vec("Hello", "World").iter().join(" ");
  
  $assertEq(hello, "Hello World");
  ```
   */
  public join(_seperator: string): string {
    return $unimplemented();
  }
  
  /**
   * Copies `this` into a new `T[]`.
   */
  public toArray() {
    return Array.from(this);
  }

  /**
   * Copies `this` into a new {@linkcode Vec}.
   * 
   * * **NOTE**: This is a creates a shallow-copy. If you want a deep-copy the use {@linkcode Vec.clone()}
   */
  public toVec() {
    return Vec.from(this);
  }
}



/**
 * A trait for dealing with iterators.
 * 
 * This is the main iterator trait.
 */
export interface IteratorTrait<T> extends IntoIterator<T> {
  /**
   * Takes two iterators and creates a new iterator over both in sequence.
   * 
   * {@linkcode chain()} will return a new iterator which will first iterate over values from the first iterator and then over values from the second iterator.
   * 
   * In other words, it links two iterators together, in a chain. 🔗
   * 
   * ### Example
  ```ts
  const a1 = $vec(1, 2, 3);
  const a2 = $vec(4, 5, 6);
  
  const iter = a1.iter().chain(a2);

  $assertEq(iter.next(), 1);
  $assertEq(iter.next(), 2);
  $assertEq(iter.next(), 3);
  $assertEq(iter.next(), 4);
  $assertEq(iter.next(), 5);
  $assertEq(iter.next(), 6);
  $assertEq(iter.next(), None());
  ```
   * 
   * Since the argument to {@linkcode chain()} uses IntoIterator, we can pass anything that can be converted into an Iterator, not just an Iterator itself.
   */

  chain(other: Iterable<T>): IteratorTrait<T>;

  /**
   * Transforms an iterator into a collection.
   * 
   * {@linkcode collect()} can take anything iterable, and turn it into a relevant collection.
   * This is one of the more powerful methods in the standard library, used in a variety of contexts.
   * 
   * The most basic pattern in which `collect()` is used is to turn one collection into another.
   * You take a collection, call {@linkcode iter()} on it, do a bunch of transformations, and then collect() at the end.
   * 
   * {@linkcode collect()} can also create instances of types that are not typical collections.
   * See the examples below for more.
   * 
   * Because `collect()` is so general, it can cause problems with type inference.
   * As such, `collect()` is one of the times when you may need to mention the generic type.
   * This helps the inference algorithm understand specifically which collection you're trying to collect into.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  const a = $set(1, 2, 3);
  const doubled: Vec<number> = a.iter()
  .map(x => x * 2)
  .collect();

  $assertEq($vec(2, 4, 6), doubled);
  ```
   * * Note that we needed the : Vec<number> on the left-hand side.
   * This is because we could collect into, for example, a LinkedList<T> instead:
  ```ts
  import { LinkedList } from "std/collections";
  
  const a = $vec(1, 2, 3);
  const doubled: LinkedList<T> = a.iter().map(x => x * 2).collect();

  $assertEq(2, doubled[0]);
  $assertEq(4, doubled[1]);
  $assertEq(6, doubled[2]);
  ```
  Using the 'turbofish' instead of annotating doubled:
  ```
  const a = $vec(1, 2, 3);
  const doubled = a.iter().map(x => x * 2).collect<LinkedList<T>>();
  
  assertEq($vec(2, 4, 6), doubled);
  ```
   * Because {@linkcode collect()} only cares about what you're collecting into.
   */
  collect<I extends IteratorTrait<T>>(): I;

  /**
   * Repeats an iterator endlessly.
   * 
   * Instead of stopping at end, the iterator will instead start again, from the beginning.
   * After iterating again, it will start at the beginning again.
   * And again. And again. Forever.
   * 
   * * **Note**: In case the original iterator is empty, the resulting iterator will also be empty.
   * 
   * ### Example
  ```ts
  const a = $vec(1, 2, 3);
  const iter = a.iter().cycle();

  $assertEq(it.next(), 1);
  $assertEq(it.next(), 2);
  $assertEq(it.next(), 3);
  $assertEq(it.next(), 1);
  $assertEq(it.next(), 2);
  $assertEq(it.next(), 3);
  $assertEq(it.next(), 1);
  ```
   */

  cycle(): IteratorTrait<T>;

  /**
   * Creates an iterator which gives the current iteration count as well as the next value.
   * 
   * The iterator returned yields pairs `[i: number, element: T]`, where `i` is the current index of iteration and `element` is the value returned by the iterator.
   * 
   * {@linkcode enumerate()} keeps its count as a `number`.
   * 
   * ### Example
  ```ts
  const a = $vec('a', 'b', 'c');
  const iter = a.iter().enumerate();

  $assertEq(iter.next(), [0, 'a']);
  $assertEq(iter.next(), [1, 'b']);
  $assertEq(iter.next(), [2, 'c']);
  $assertEq(iter.next(), None());
  ```
   */

  enumerate(): IteratorTrait<T>;
  /**
   * Creates an iterator which uses a callback function to determine if an element should be yielded.
   * 
   * Given an element the callback function must return `true` or `false`.
   * The returned iterator will yield only the elements for which {@linkcode f} returns `true`.
   * 
   * ### Example
   * 
  ```ts
  const a = $vec(0, 1, 2);
  const iter = a.iter().filter(x => x > 0);

  $assertEq(iter.next(), 1);
  $assertEq(iter.next(), 2);
  $assertEq(iter.next(), None());
  ```
   */

  filter(f: Fn<[element: T],boolean>): IteratorTrait<T>;
  /**
   * Searches for an element of an iterator that satisfies a predicate.
   * 
   * {@linkcode find()} takes a callback that returns `true` or `false`.
   * It applies this callback to each element of the iterator, and if any of them return `true`, then {@linkcode find()} returns `Some(T)`. If they all return `false`, it returns `None`.
   * 
   * {@linkcode find()} is short-circuiting;
   * in other words, it will stop processing as soon as the callback function returns `true`.
   * 
   * 
   * * If you need the index of the element, see {@linkcode position}.
   * 
   * ### Examples
  ```ts
  const a = $vec(1, 2, 3);
  
  $assertEq(a.iter().find(x => x == 2), 2);
  
  $assertEq(a.iter().find(x => x == 5), None());
  ```
   * Stopping at the first `true`:
  ```ts
  const a = $vec(1, 2, 3);
  const iter = a.iter();
  
  $assertEq(iter.find(x => x == 2), 2);
  ```
   */
  find(f: Fn<[element: T],boolean>): Option<T>;

  /**
   * Applies callback function to the elements of iterator and returns the first non-none result.
   * 
   * `iter.findMap(f)` is equivalent to iter.filterMap(f).next();
   * 
   * ### Examples
  ```ts
  const a = $vec("lol", "NaN", 69, 5);
  const firstNumber = a.iter().findMap(x => typeof x==="number");
  
  $assertEq(firstNumber, 69);
  ```
   */
  findMap<U>(f: Fn<[element: T],Optional<U>>): Option<T>;

  /**
   * Creates an iterator that both filters and maps.
   * 
   * The returned iterator yields only the values for which the supplied callback returns `Some(T)`.
   * 
   * {@linkcode filterMap} can be used to make chains of {@linkcode filter} and {@linkcode map} more concise.
   * The example below shows how a `map().filter().map()` can be shortened to a single call to {@linkcode filterMap}.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  import { fs,$vec } from "std";

  const filePaths = $vec("hello-friend.txt", "who-am-i.txt", "goodbye-friend.txt");

  const texts = filePaths
  .iter()
  .filterMap(path => fs.readToStringSync(path).ok())
  .collect<Vec<string>>();

  console.log(texts);
  ```
   */
  filterMap<U>(f: Fn<[element: T],Optional<U>>): IteratorTrait<U>;

  /**
   * Creates an iterator that works like map, but flattens nested structure.
   * 
   * The {@linkcode map} adapter is very useful, but only when the callback function produces values.
   * If it produces an iterator instead, there's an extra layer of indirection.
   * {@linkcode flatMap()} will remove this extra layer on its own.
   * 
   * You can think of {@linkcode flatMap(f)} as the semantic equivalent of {@linkcode map}ping, and then {@linkcode flatten}ing as in `map(f).flatten()`.
   * 
   * Another way of thinking about {@linkcode flatMap()}: {@linkcode map}'s callback function returns one item for each element, and {@linkcode flatMap()}'s callback function returns an iterator for each element.
   * 
   * ### Example
  ```ts
  const words = $vec("alpha", "beta", "gamma");

  const merged = words.iter()
  .flatMap(str => [...str])
  .join("");
  
  $assertEq(merged, "alphabetagamma");
  ```
   */
  flatMap<U>(f: Fn<[element: T],Option<U>>): IteratorTrait<U>;
  
  /**
   * Creates an iterator that flattens nested structure.
   * 
   * This is useful when you have an iterator of iterators or an iterator of things that can be turned into iterators and you want to remove one level of indirection.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  const data = $vec($vec(1, 2, 3, 4), $vec(5, 6));
  const flattened = data.iter().flatten().collect();
  
  $assertEq(flattened,[1, 2, 3, 4, 5, 6]);
  ```
  ```ts
  const words = $vec("alpha", "beta", "gamma");
  const merged = words.iter()
  .map(str => [...str])
  .flatten()
  .join("");
  
  $assertEq(merged, "alphabetagamma");
  ```
   * You can also rewrite this in terms of {@linkcode flatMap}, which is preferable in this case since it conveys intent more clearly:
  ```ts
  const words = $vec("alpha", "beta", "gamma");
  const merged = words.iter()
  .flatMap(str => [...str])
  .join("");
  
  $assertEq(merged, "alphabetagamma");
  ```
   * Flattening works on any {@linkcode IntoIterator} type, including {@linkcode Option} and {@linkcode Result}:
  ```ts
  const options = $vec(Some(123), Some(321), None(), Some(231));
  const flattenedOptions = options.iter().flatten().collect<Vec<number>>();
  
  $assertEq(flattenedOptions, $vec(123, 321, 231));
  ```
  ```ts
  const results = $vec(Ok(123), Ok(321), Err(456), Ok(231));
  const flattenedResults = results.iter().flatten().collect<Vec<number>>();
  
  $assertEq(flattenedResults, $vec(123, 321, 231));
  ```
   * Flattening only removes one level of nesting at a time:
  ```ts
  const d3 = $vec([[1, 2], [3, 4]], [[5, 6], [7, 8]]);
  const d2 = d3.iter().flatten().collect<Vec<number>>();
  
  $assertEq(d2, [[1, 2], [3, 4], [5, 6], [7, 8]]);

  const d1 = d3.iter().flatten().flatten().collect::<Vec<number>>();
  $assertEq(d1, [1, 2, 3, 4, 5, 6, 7, 8]);
  ```
   * Here we see that {@linkcode flatten()} does not perform a "deep" flatten.
  Instead, only one level of nesting is removed.
  That is, if you {@linkcode flatten()} a three-dimensional array, the result will be two-dimensional and not one-dimensional.
  To get a one-dimensional structure, you have to {@linkcode flatten()} again.
   */
  // deno-lint-ignore no-explicit-any
  flatten<U>(): IteratorTrait<T extends Iterable<any>?U:T>;

  /**
   * Does something with each element of an iterator, passing the value on.
   * 
   * When using iterators, you'll often chain several of them together.
   * While working on such code, you might want to check out what's happening at various parts in the pipeline.
   * To do that, insert a call to {@linkcode inspect()}.
   * 
   * It's more common for {@linkcode inspect()} to be used as a debugging tool than to exist in your final code, but applications may find it useful in certain situations when errors need to be logged before being discarded.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  const a = $vec(1, 4, 2, 3);
  
  // this iterator sequence is complex.
  const basicSum = a.iter()
  .cloned()
  .filter(x => x % 2 == 0)
  .fold(0, (sum, i)=> sum + i);
  
  console.log(`Sum: ${basicSum}`);
  
  // let's add some inspect() calls to investigate what's happening
  const sum = a.iter()
  .cloned()
  .inspect(x => console.log(`about to filter: ${x}`))
  .filter(x => x % 2 == 0)
  .inspect(x => console.log(`made it through filter: ${x}`))
  .fold(0, (sum, i)=> sum + i);
  
  console.log();
  ```
  This will print:
  ```pre
  6
  about to filter: 1
  about to filter: 4
  made it through filter: 4
  about to filter: 2
  made it through filter: 2
  about to filter: 3
  6
  ```
   * Logging errors before discarding them:
  ```ts
  import { fs,$vec } from "std";

  const filePaths = $vec("hello-friend.txt", "who-am-i.txt", "goodbye-friend.txt");

  const texts = filePaths
  .iter()
  .map(path => fs.readToStringSync(path))
  .inspect(file => {
    if(file.containsErr()) {
      console.log("Some error occured while opening the file...");
    }
  })
  .filterMap(res => res.ok())
  .collect<Vec<string>>();

  console.log(texts);
  ```
   */
  inspect(f: Fn<[element: T],void>): IteratorTrait<T>;

  /**
   * Takes a callback function and creates an iterator which calls that callback function on each element.
   * 
   * {@linkcode map()} transforms one iterator into another, by means of its argument.
   * It produces a new iterator which calls this callback on each element of the original iterator.
   * 
   * If you are good at thinking in types,
   * you can think of `map()` like this: If you have an iterator that gives you elements of some type `A`,
   * and you want an iterator of some other type `B`, you can use `map()`,
   * passing a callback function that takes an A and returns a B.
   * 
   * `map()` is conceptually similar to a for loop.
   * However, as `map()` is lazy, it is best used when you're already working with other iterators.
   * If you're doing some sort of looping for a side effect, it's considered more idiomatic to use for than `map()`.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  const a = $vec(1, 2, 3);
  const iter = a.iter().map(x =>  2 * x);

  $assertEq(iter.next(), 2);
  $assertEq(iter.next(), 4);
  $assertEq(iter.next(), 6);
  $assertEq(iter.next(), None());
  ```
   * If you're doing some sort of side effect, prefer for to map():
  ```ts
  // don't do this:
  $range(0,5).map(console.log);

  // Instead, use a for-loop:
  for(let x=0;x<5;x++) {
    console.log(x);
  }
  ```
   */
  map<U>(f: Fn<[element: T,index: number],U>): IteratorTrait<U>;

  /**
   * Creates an iterator that both yields elements based on a predicate and maps.
   * 
   * {@linkcode mapWhile()} takes a callback function as an argument.
   * It will call this callback on each element of the iterator, and yield elements while it returns `Some(T)`.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  const a = $vec(1, 2, 3, 4);
  const iter = a.iter().mapWhile(i => a.get(i));

  $assertEq(iter.next(), 2);
  $assertEq(iter.next(), 3);
  $assertEq(iter.next(), 4);
  $assertEq(iter.next(), None());
  ```
   * Here's the same example, but with {@linkcode takeWhile} and {@linkcode map}:
  ```ts
  const a = $vec(1, 2, 3, 4);
  const iter = a.iter()
  .map(x => a.get(i))
  .takeWhile(x => x.contains())
  .map(x => x.unwrap());

  $assertEq(iter.next(), 2);
  $assertEq(iter.next(), 3);
  $assertEq(iter.next(), None());
  ```
   * Because {@linkcode mapWhile()} needs to look at the value in order to see if it should be included or not, consuming iterators will see that it is removed:
   * * Note that unlike {@linkcode takeWhile} this iterator doesn't short-circuit.
   */
  mapWhile<U>(f: Fn<[element: T,index: number],Optional<U>>): IteratorTrait<U>;
  
  /**
   * Returns the nth element of the iterator.
   * 
   * Like most indexing operations, the count starts from zero,
   * so `nth(0)` returns the first value, `nth(1)` the second, and so on.
   * 
   * {@linkcode nth()} will return `None` if {@linkcode n} is less than 0 or greater than or equal to the length of the iterator.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  const a = $vec(1, 2, 3);
  
  $assertEq(a.iter().nth(1), Some(2));
  ```
   */
  nth(n: number): Option<T>;

  /**
   * Searches for an element in an iterator, returning its index.
   * 
   * {@linkcode position()} takes a callback function that returns `true` or `false`.
   * It applies this callback to each element of the iterator, and if one of them returns `true`, then `position()` returns `Some(index)`.
   * If all of them return false, it returns `None`.
   * 
   * `position()` is short-circuiting;
   * in other words, it will stop processing as soon as it finds a `true`.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  const a = $vec(1, 2, 3);
  
  $assertEq(a.iter().position(x => x === 2), Some(1));
  
  $assertEq(a.iter().position(x => x === 5), None());
  ```
  Stopping at the first `true`:
  const a = $vec(1, 2, 3, 4);
  const iter = a.iter();
  
  $assertEq(iter.position(x => x >= 2), Some(1));
  ```
   */
  position(f: Fn<[element: T],boolean>): number;

  /**
   * An iterator adapter which, like {@linkcode fold}, holds internal state, but unlike {@linkcode fold}, produces a new iterator.
   * 
   * {@linkcode scan()} takes two arguments:
   * an initial value which seeds the internal state, and a callback function with two arguments,
   * the first being the internal state and the second an iterator element.
   * The callback can assign to the internal state to share state between iterations.
   * 
   * On iteration, the callback function will be applied to each element of the iterator and the return value from the callback, an {@linkcode Optional<T>}, is returned by the next method.
   * Thus the callback can return `Some(value)` to yield value, or `None` to end the iteration.
   * 
   * ### Example
   * Basic usage:
  ```ts
  const a = $vec(1, 2, 3, 4);
  
  const iter = a.iter().scan(1, (state, x)=> {
      // each iteration, we'll multiply the state by the element ...
      state = state * x;

      // ... and terminate if the state exceeds 6
      if state > 6 {
        return None(); // an equivalent like `null` can also be passed..
      }
      // ... else yield the negation of the state
      Some(-1*state)
  });

  $assertEq(iter.next(), -1);
  $assertEq(iter.next(), -2);
  $assertEq(iter.next(), -6);
  $assertEq(iter.next(), None());
  ```
   */
  scan<St,B>(init: St,f: Fn<[prev: St,element: T],Optional<B>>): IteratorTrait<T>;

  /**
   * Creates an iterator that skips the first {@linkcode n} elements.
   * 
   * {@linkcode skip} skips elements until `n` elements are skipped or the end of the iterator is reached (whichever happens first).
   * After that, all the remaining elements are yielded.
   * In particular, if the original iterator is too short, then the returned iterator is empty.
   * 
   * Rather than overriding this method directly, instead override the nth method.
   * 
   * ### Example
   * Basic usage:
  ```ts
  const a = $vec(1, 2, 3);
  const iter = a.iter().skip(2);
  
  $assertEq(iter.next(), 3);
  $assertEq(iter.next(), None());
   */
  skip(n: number): IteratorTrait<T>;

  /**
   * Creates an iterator that {@linkcode skip}s elements based on a predicate.
   * 
   * {@linkcode skipWhile()} takes a callback function as an argument.
   * It will call this callback on each element of the iterator, and ignore elements until it returns `false`.
   * 
   * After `false` is returned, `skipWhile()`'s job is over, and the rest of the elements are yielded.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  const a = $vec(-1, 0, 1);
  const iter = a.iter().skipWhile(x => x < 0);

  $assertEq(iter.next(), 0);
  $assertEq(iter.next(), 1);
  $assertEq(iter.next(), None());
  ```
  Stopping after an initial `false`:
  ```ts
  const a = $vec(-1, 0, 1, -2);
  const iter = a.iter().skipWhile(x => x < 0);

  $assertEq(iter.next(), 0);
  $assertEq(iter.next(), 1);


  // while this would have been `false`, since we already got a `false`,
  // `skipWhile()` isn't used any more
  $assertEq(iter.next(), -2);
  
  $assertEq(iter.next(), None());
  ```
   */
  skipWhile(f: Fn<[element: T],boolean>): IteratorTrait<T>;

  /**
   * Creates an iterator starting at the same point, but stepping by the given amount at each iteration.
   * 
   * * **None 1**: The first element of the iterator will always be returned, regardless of the step given.
   * * **Note 2**: The time at which ignored elements are pulled is not fixed.
   * {@linkcode stepBy()} behaves like the sequence `this.next()`, `self.nth(step-1)`....,
   * 
   * ### Example
   * Basic usage:
  ```ts
  const a = $vec(0, 1, 2, 3, 4, 5);
  const iter = a.iter().stepBy(2);

  $assertEq!(iter.next(), 0);
  $assertEq!(iter.next(), 2);
  $assertEq!(iter.next(), 4);
  $assertEq!(iter.next(), None());
  ```
   */
  stepBy(step: number): IteratorTrait<T>;

  /**
   * Creates an iterator that yields the first {@linkcode n} elements, or fewer if the underlying iterator ends sooner.
   * 
   * {@linkcode take} yields elements until `n` elements are yielded or the end of the iterator is reached (whichever happens first).
   * The returned iterator is a prefix of length `n` if the original iterator contains at least `n` elements, otherwise it contains all of the (fewer than `n`) elements of the original iterator.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  const a = $vec(1, 2, 3);
  const iter = a.iter().take(2);

  $assertEq(iter.next(), 1);
  $assertEq(iter.next(), 2);
  $assertEq(iter.next(), None());
  ```
   * `take()` is often used with an infinite iterator, to make it finite:
  ```ts
  const iter = $range(0,Infinity).take(3);
  
  $assertEq(iter.next(), 0);
  $assertEq(iter.next(), 1);
  $assertEq(iter.next(), 2);
  $assertEq(iter.next(), None());
  ```
   * If less than `n` elements are available, take will limit itself to the size of the underlying iterator:
  ```ts
  const v = $vec(1, 2);
  const iter = v.into_iter().take(5);

  $assertEq(iter.next(), 1);
  $assertEq(iter.next(), 2);
  $assertEq(iter.next(), None());
  ```
   */
  take(n: number): IteratorTrait<T>;
  
  /**
   * Creates an iterator that yields elements based on a predicate.
   * 
   * {@linkcode takeWhile} takes a callback function as an argument.
   * It will call this callback function on each element of the iterator,
   * and yield elements while it returns `true`.
   * 
   * After `false` is returned, `takeWhile()`'s job is over, and the rest of the elements are ignored.
   * 
   * ### Example
   * Basic usage:
  ```ts
  const a = $vec(-1, 0, 1);
  const iter = a.iter().takeWhile(x => x < 0);

  $assertEq(iter.next(), -1);
  $assertEq(iter.next(), None());
  ```
   */
  takeWhile(f: Fn<[element: T],boolean>): IteratorTrait<T>;

  /**
   * 'Zips up' two iterators into a single iterator of pairs.
   * 
   * {@linkcode zip()} returns a new iterator that will iterate over two other iterators,
   * returning a tuple where the first element comes from the first iterator, and the second element comes from the second iterator.
   * 
   * In other words, it zips two iterators together, into a single one.
   * 
   * If either iterator ends, the zipped iterator will also end.
   * If the zipped iterator has no more elements to return then each further attempt to advance it will first try to advance the first iterator at most one time and if it still yielded an item try to advance the second iterator at most one time.
   * 
   * To 'undo' the result of zipping up two iterators, see {@linkcode unzip}.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  const a1 = $vec(1, 2, 3);
  const a2 = $vec(4, 5, 6);

  const iter = a1.iter().zip(a2);

  $assertEq(iter.next(), [1, 4]);
  $assertEq(iter.next(), [2, 5]);
  $assertEq(iter.next(), [3, 6]);
  $assertEq(iter.next(), None());
  ```
   * Since the argument to `zip()` uses {@linkcode Iterable}, we can pass anything that implements the {@linkcode Iterable} interface,
   * For example, slices and arrays (`T[]`) implement {@linkcode Iterable}, and so can be passed to `zip()` directly:
   * 
   * `zip()` is often used to zip an infinite iterator to a finite one.
   * This works because the finite iterator will eventually end, ending the zipper.
   * Zipping with `$range(0)` or `$range(0,Infinity)` can look a lot like {@linkcode enumerate}:
  ```ts
  const enumerate: Vec<string> = $chars("foo").enumerate().collect();
  const zipper: Vec<string> = $range(0).zip($chars("foo")).collect();

  $assertEq([0, 'f'], enumerate[0]);
  $assertEq([0, 'f'], zipper[0]);

  $assertEq([1, 'o'], enumerate[1]);
  $assertEq([1, 'o'], zipper[1]);

  $assertEq([2, 'o'], enumerate[2]);
  $assertEq([2, 'o'], zipper[2]);
  ```
  * If both iterators have roughly equivalent syntax, it may be more readable to use {@linkcode zip}:
  ```ts
  const a1 = $vec(1, 2, 3);
  const a2 = $vec(2, 3, 4);
  
  const zipped = zip(
      a.iter().map(x => x * 2).skip(1),
      b.iter().map(x => x * 2).skip(1),
  );

  $assertEq(zipped.next(), [4, 6]);
  $assertEq(zipped.next(), [6, 8]);
  $assertEq(zipped.next(), None());
  ```
   * compared to:
  ```ts
  const zipped = a
  .iter()
  .map(x => x * 2)
  .skip(1)
  .zip(b.iter().map(x => x * 2).skip(1));
  ```
   */
  zip<U>(other: Iterable<U>): IteratorTrait<[T,U]>;

  /**
   * Converts an iterator of pairs into a pair of containers.
   * 
   * {@linkcode unzip()} consumes an entire iterator of pairs, producing two collections:
   * one from the left elements of the pairs, and one from the right elements.
   * 
   * This function is, in some sense, the opposite of {@linkcode zip}.
   * 
   * ### Examples
   * Basic usage:
  ```ts
  const a = $vec([1, 2], [3, 4], [5, 6]);
  const [left, right]: [Iterable<number>, Iterable<number>] = a.iter().cloned().unzip();

  $assertEq(Arr.from(left), [1, 3, 5]);
  $assertEq(Arr.from(right), [2, 4, 6]);
  ```
   */
  unzip(): never;
}


