import { IteratorTrait } from "../mod.ts";

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
export class HashSet<T> extends IteratorTrait<T> {
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
  
  const set = HashSet.from([1, 2, 3]);

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
}

