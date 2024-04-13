

/**
 * Extend a collection with the contents of an iterator.
 * 
 * Iterators produce a series of values, and collections can also be thought of as a series of values.
 * The {@linkcode Extend} trait bridges this gap, allowing you to extend a collection by including the contents of that iterator.
 * When extending a collection with an already existing key, that entry is updated or, in the case of collections that permit multiple entries with equal keys, that entry is inserted.
 * 
 * ### Examples
 * Basic usage:
```ts

// You can extend a `Vec` with some elements:
  const vec = $vec(1,2,3);
  
  vec.extend([4,5,6]);
  $assertEq([1,2,3,4,5,6],vec);
```
 * 
 * ### Implementing Extend:
```
// A sample collection, that's just a wrapper over Vec<T>.
class MyCollection implements Extend<number> {// since MyCollection has a list of numbers, we implement Extend for number
     private inner: Vec<number>;
     constructor() {
       this.inner=new Vec();
     }

     public add(elem: number) {
       this.inner.push(elem);
     }
     
     // This is a bit simpler with the concrete type signature: we can call
     // extend on anything which can be turned into an Iterator which gives
     // us i32s. Because we need i32s to put into MyCollection.
     public extend<I extends Iterable<T>>(iter: I) {
       // The implementation is very straightforward: loop through the
       // iterator, and {@linkcode add()} each element to ourselves.
       for(const elem in iter) {
         this.add(elem);
       }
     }
}

const c = new MyCollection();

c.add(5);
c.add(6);
c.add(7);

// let's extend our collection with three more numbers
c.extend([1, 2, 3]);

// we've added these elements onto the end
$assertEq("MyCollection([5, 6, 7, 1, 2, 3])",);
```
 */
export interface Extend<T> {
  /**
   * Extends a collection with the contents of an iterator.
   * 
   * ### Examples
  ```ts
  // You can extend a `Vec` with some elements:
  const vec = $vec(1,2,3);
  
  vec.extend([4,5,6]);
  $assertEq([1,2,3,4,5,6],vec);
  ```
   */
  extend<I extends Iterable<T>>(iter: I): void;
}


