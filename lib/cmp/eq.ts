

/**
 * Trait for comparisons corresponding to equivalence relations.
 * 
 * This means, that in addition to a === b and a !== b being strict inverses,
 * the relation must be (for all a, b and c):
 * 
 * * reflexive: a === a;
 * 
 * * symmetric: a === b implies b === a (required by {@linkcode PartialEq} as well); and
 * 
 * * transitive: a === b and b === c implies a === c (required by {@linkcode PartialEq} as well).
 * 
 * This property cannot be checked by the compiler, and therefore {@linkcode Eq} implies {@linkcode PartialEq},
 * and has no extra methods.
 * 
 * Violating this property is a logic error.
 * The behavior resulting from a logic error is not specified,
 * but users of the trait must ensure that such logic errors do not result in undefined behavior.
 * This means that unsafe code must not rely on the correctness of these methods.
 * 
 * Implement Eq in addition to PartialEq if it's guaranteed that {@linkcode PartialEq.eq} always returns `true`
 * (reflexivity), in addition to the symmetric and transitive properties already required by `PartialEq`.
 * 
 * ### Derivable
 * This trait can be used with `@derive`. When derived, because Eq has no extra methods,
 * it is only informing the compiler that this is an equivalence relation rather than a partial equivalence relation.
 * 
 * **NOTE**: 
 * * The `derive` strategy checks whether all fields are {@linkcode Eq}, which isn't always desired.
 * * Sometimes only one or some of the properties are checked to be equal in that case checkout {@linkcode PartailEq}
 * 
 * #### How can I implement {@linkcode Eq}?
 * 
 * If you cannot use the derive strategy, specify that your type implements {@linkcode Eq}:
```ts
class Vec2 implements Eq {
     constructor(public x: number,public y: number) {}

     public eq(rhs: Vec2) {
       return this.x === rhs.x && this.y === rhs.y;
     }
}
```
 */
export interface Eq extends PartailEq {
  /**
   * This method tests for `this` and other values to be equal, and uses `===` internally.
   * @returns {boolean}
   */
  eq(rhs: this): rhs is this;
}


/**
 * Trait for comparisons using the equality operator.
 * 
 * 
 * This trait allows for comparisons, for types that do not have a full equivalence relation.
 * For example, `array`s and `vector`s, `$vec() != []`, so {@linkcode Vec} implements {@linkcode PartialEq} but not {@linkcode Eq}.
 * Formally speaking, when {@linkcode Rhs} == `this`, this trait corresponds to a partial equivalence relation.
 * 
 * 
 * If {@linkcode PartialOrd} or {@linkcode Ord} are also implemented for `this` and {@linkcode Rhs},
 * their methods must also be consistent with {@linkcode PartialEq}
 * 
 * The equality relation == must satisfy the following conditions (for all a, b, c of type A, B, C):
 * 
 * * Symmetric: if `A extends PartialEq<B>` and `B extends PartialEq<A>`, then `a == b` implies `b == a`; and
 * * Transitive: if `A extends PartialEq<B>` and `B extends PartialEq<C>` and `A extends PartialEq<C>`,
 * then a == b and b == c implies a == c.
 * 
 * * Note that the `B extends PartialEq<A>` (symmetric) and `A extends PartialEq<C>` (transitive) impls are not forced to exist,
 * but these requirements apply whenever they do exist.
 * 
 * Violating these requirements is a logic error.
 * The behavior resulting from a logic error is not specified,
 * but users of the trait must ensure that such logic errors do not result in undefined behavior.
 * This means that unsafe code must not rely on the correctness of these methods.
 * 
 * ### Derivable
 * This trait can be used with `@derive`.
 * When derived on classes,
 * two instances are equal if all fields are equal, and not equal if any fields are not equal.
 * 
 * #### How can I implement {@linkcode PartialEq}?
 * 
 * An example implementation for a domain in which two books are considered the same book if their ISBN matches, even if the formats differ:
```ts
// enum BookFormat {...}
type BookFormat=0|1|2;
const BookFormat={
     Paperback=0,
     Hardback=1,
     Ebook=2
}

class Book implements PartialEq {
     constructor(isbn: number,format: BookFormat) {}

     public eq(rhs: Book) {
       return this.isbn === rhs.isbn && this.format === rhs.format;
     }
}


const b1 = new Book(3, BookFormat.Paperback);
const b2 = new Book(3, BookFormat.Ebook);
const b3 = new Book(10, BookFormat.Paperback);

$assertEq(b1, b2);
$assertEq(b1, b3);
```
 * #### How can I compare two different types?
 * 
 * The type you can compare with is controlled by {@linkcode PartialEq}'s type parameter.
 * For example, let's tweak our previous code a bit:
```ts
type BookFormat=0|1|2;
const BookFormat={
     Paperback=0,
     Hardback=1,
     Ebook=2
}

class Book implements PartialEq<Book|BookFormat> {
     constructor(isbn: number,format: BookFormat) {}

     public eq(rhs: Book|BookFormat) {
       return rhs instanceof Book ? this.isbn === rhs.isbn && this.format === rhs.format : this.format === rhs;
     }
}

const b1 = new Book(3, BookFormat.Paperback);

$assertEq(b1,BookFormat::Paperback);
```
 */
export interface PartailEq<Rhs=ThisType<unknown>> {
  /**
   * This method returns whether `this` and {@linkcode rhs} are equal.
   * It is similiar to `==`.
   */
  eq(rhs: Rhs): boolean;
}



