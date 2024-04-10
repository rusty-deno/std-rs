import { IteratorTrait } from "../mod.ts";
import { PartailEq,$eq } from "../../cmp/mod.ts";

type Equivalent<T>=HashSet<T>|Set<T>;

/**
 * An superset of native {@linkcode Set}.
 * 
 * ### Examples
```ts
import { HashSet } from "std/collections";

const books = new HashSet("A Dance With Dragons", "To Kill a Mockingbird", "The Odyssey", "The Great Gatsby");

if(!books.contains("The Winds of Winter")) {
     console.log(`We have ${books.length} books, but The Winds of Winter ain't one.`);
}

// Remove a book.
books.remove("The Odyssey");

// Iterate over everything.
for(const book of books) {
     console.log(book);
}
```
 */
export class HashSet<T> extends IteratorTrait<T> implements PartailEq<Equivalent<T>> {
  #set: Set<T>;

  constructor(...entries: T[]) {
    super();
    this.#set=new Set(entries);
  }

  /**
   * Creates a {@linkcode HashSet} from another set.
   * 
   * ### Examples
  ```ts
  import { HashSet } from "std/collections";

  const nums = HashMap.from(new Set([1,2,69,420,69]));
  ```
   */
  public static fromIter<T>(iter: Iterable<T>): HashSet<T> {
    const set=new HashSet<T>();
    set.#set=new Set(iter);
    return set;
  }

  static #fromSet<T>(set: Set<T>): HashSet<T> {
    const self=new HashSet<T>();
    self.#set=set;

    return self;
  }


  /**
   * Returns the number of elements in the set.
   * ### Examples
  ```ts
  import { HashSet } from "std/collections";
  
  const v = new HashSet<number>();
  
  $assertEq(v.length, 0);
  v.insert(1);
  $assertEq(v.len(), 1);
  ```
   */
  public get length(): number {
    return this.#set.size;
  }
  
  public eq(other: Equivalent<T>): boolean {
    return this===other || (other instanceof HashSet?$eq(this.#set,other.#set):$eq(this.#set,other));
  }

  *[Symbol.iterator](): Iterator<T> {
    yield* this.#set;
  }

  /**
   * Adds a value to the set.
   * 
   * Returns whether the value was newly inserted. i.e:
   * 
   * * If the set did not previously contain this value, `true` is returned.
   * * If the set already contained this value, `false` is returned, and the set is not modified: original value is not replaced, and the value passed as argument is dropped.
   * 
   * ### Examples
  ```ts
  import { HashSet } from "std/collections";

  const set = new HashSet();

  $assertEq(set.insert(2), true);
  $assertEq(set.insert(2), false);
  $assertEq(set.len(), 1);
  ```
   */
  public insert(element: T): boolean {
    const prevLen=this.length;
    return this.#set.add(element).size!==prevLen;
  }
  
  /**
   * Removes a value from the set. Returns whether the value was present in the set.
   * 
   * ### Examples
  ```ts
  import { HashSet } from "std/collections";

  const set = new HashSet();
  
  set.insert(2);

  $assertEq(set.remove(2), true);
  $assertEq(set.remove(2), false);
  ```
   */
  public remove(element: T): boolean {
    return this.#set.delete(element);
  }

  /**
   * Returns true if the set contains a value.
   * 
   * ### Examples
  ```ts
  import { HashSet } from "std/collections";
  
  const set = HashSet.fromIter([1, 2, 3]);

  $assertEq(set.contains(1), true);
  $assertEq(set.contains(4), false);
  ```
   */
  public contains(element: T): boolean {
    return this.#set.has(element);
  }

  /**
   * Clears the set, removing all values.
   * 
   * ### Examples
  ```ts
  import { HashSet } from "std/collections";

  const set = new HashSet<number>();
  
  set.insert(1);
  set.clear();
  $assert(set.isEmpty());
  ```
   */
  public clear() {
    this.#set.clear();
  }
  
  /**
   * Returns true if the set contains no elements.
   * 
   * ### Examples
  ```ts
  import { HashSet } from "std/collections";

  const set = new HashSet();

  $assert(set.isEmpty());

  set.insert(1);
  $assert(!set.isEmpty());
  ```
   */
  public isEmpty(): boolean {
    return !this.#set.size;
  }

  /**
   * Visits the values representing the difference,
   * i.e., the values that are in `this` but not in `other`.
   * 
   * ### Examples
  ```ts
  import { HashSet } from "std/collections";

  const a = new HashSet(1, 2, 3);
  const b = new HashSet(4, 2, 3, 4);

  // Can be seen as `a - b`.
  for(const x of a.difference(b)) {
       console.log(x); // prints 1
  }
  
  const diff = a.difference(b);
  $assertEq(diff, new HashSet(1));

  // Note that difference is not symmetric,
  // and `b - a` means something else:
  const diff = b.difference(a);
  $assertEq(diff,new HashMap(4));
  ```
   */
  public difference(other: Equivalent<T>): HashSet<T> {
    return HashSet.#fromSet<T>(this.#set.difference(other instanceof Set?other:other.#set) as Set<T>);
  }

  /**
   * Visits the values representing the intersection,
   * i.e., the values that are both in `this` and `other`.
   * 
   * When an equal element is present in self and other then the resulting Intersection may yield references to one or the other.
   * 
   * ### Examples
  ```ts
  import { HashSet } from "std/collections";
  const a = new HashSet(1, 2, 3);
  const b = new HashSet(4, 2, 3, 4);

  // Prints 2, 3 in arbitrary order.
  for(const x of a.intersection(b)) {
       console.log(x);
  }

  cpmst intersection = a.intersection(b);
  $assertEq(intersection,new HashMap(2, 3));
   */
  public intersection(other: Equivalent<T>): HashSet<T> {
    return HashSet.#fromSet(this.#set.intersection(other instanceof Set?other:other.#set));
  }

  /**
   * Returns `true` if `this` has no elements in common with `other`.
   * This is equivalent to checking for an empty intersection.
   * 
   * ### Examples
  ```ts
  import { HashSet } from "std/collections";

  cost a = new HashSet(1, 2, 3);
  cont b = new HashSet();

  $assertEq(a.isDisjoint(b), true);

  b.insert(4);
  $assertEq(a.isDisjoint(b), true);

  b.insert(1);
  $assertEq(a.isDisjoint(b), false);
  ```
   */
  public isDisjoint(other: Equivalent<T>): boolean {
    return this.#set.isDisjointFrom(other instanceof HashSet?other.#set:other);
  }

  /**
   * Returns `true` if `this` is a subset of `other`,
   * i.e., `other` contains at least all the values in `this`.
   * 
   * ### Examples
  ```ts
  import { HashSet } from "std/collections";

  const sup = new HashSet(1, 2, 3);
  const set = new HashSet();

  $assertEq(set.isSubset(sup), true);

  set.insert(2);
  $assertEq(set.isSubset(sup), true);

  set.insert(4);
  $assertEq(set.isSubset(sup), false);
  ```
   */
  public isSubset(other: Equivalent<T>): boolean {
    return this.#set.isSubsetOf(other instanceof HashSet?other.#set:other);
  }

  /**
   * Returns `true` if `this` is a superset of another,
   * i.e., `this`contains at least all the values in `other`.
   * 
   * ### Examples
  ```ts
  import { HashSet } from "std/collections";

  const sub = new HashSet(1, 2);
  const set = new HashSet();

  $assertEq(set.isSuperset(sub), false);

  set.insert(0);
  set.insert(1);
  $assertEq(set.isSuperset(sub), false);

  set.insert(2);
  $assertEq(set.isSuperset(sub), true);
   */
  public isSuperset(other: Equivalent<T>): boolean {
    return this.#set.isSupersetOf(other instanceof HashSet?other.#set:other);
  }

  /**
   * Visits the values representing the symmetric difference,
   * i.e., the values that are in `this` or in `other` but not in both.
   * 
   * ### Examples
  ```ts
  const a = new HashSet(1, 2, 3);
  const b = new HashSet(4, 2, 3, 4);

  // Prints 1, 4 in arbitrary order.
  for(const x of a.symmetricDifference(&b)) {
       console.log(x);
  }

  const diff1 = a.symmetricDifference(b);
  const diff2 = b.symmetricDifference(a);

  $assertEq(diff1, diff2);
  $assertEq(diff1, new HashSet(1,4));
  ```
   */
  public symmetricDifference(other: Equivalent<T>): HashSet<T> {
    return HashSet.#fromSet(this.#set.symmetricDifference(other instanceof HashSet?other.#set:other));
  }

  /**
   * Visits the values representing the union,
   * i.e., all the values in `this` or `other`, without duplicates.
   * 
   * ### Examples
  ```ts
  const a = new HashSet(1, 2, 3);
  const b = new HashSet(4, 2, 3, 4);

  // Print 1, 2, 3, 4 in arbitrary order.
  for(const x of a.union(b)) {
       console.log(x);
  }

  const union = a.union(b);
  $assertEq(union,new HashSet(1, 2, 3, 4));
  ```
   */
  public union(other: Equivalent<T>): HashSet<T> {
    return HashSet.#fromSet(this.#set.union(other instanceof HashSet?other.#set:other));
  }
}

