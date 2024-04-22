import { Enum } from "../types.ts";
import { Option } from "../../mod.ts";
import { Eq,PartailEq } from "./eq.ts";


/**
 * An Ordering is the result of a comparison between two values.
 * 
 * ### Examples
```ts
import { Ordering } from "std/cmp";
import { Option } from '../error/option/option';
import { Eq, PartailEq } from './eq';

$assertEq($cmp("a","xd"), Ordering.Less);

$assertEq($cmp("xd","xd"), Ordering.Equal);

$assertEq($cmp("xd","a"), Ordering.Greater);
```
 */
export type Ordering=Enum<typeof Ordering>;
export const Ordering={
  /** An ordering where a compared value is less than another. */
  Less: -1,
  /** An ordering where a compared value is equal to another. */
  Equal: 0,
  /** An ordering where a compared value is greater than another. */
  Greater: 1,
} as const;



export interface Ord extends PartialOrd<ThisType<unknown>>,Eq {
  /**
   * This method returns an Ordering between `this` and `other`.
   * 
   * By convention, `this.cmp(other)` returns the ordering matching the expression `this <operator> other` if true.
   * 
   * ### Examples
  ```ts
  import { Ordering } from "std/cmp";

  $assertEq($cmp(5,10), Ordering.Less);
  $assertEq($cmp(10,5), Ordering.Greater);
  $assertEq($cmp(5,5), Ordering.Equal);
  ```
   */
  cmp(other: this): Ordering;
  eq(rhs: this): boolean;
}

export interface PartialOrd<Rhs> extends PartailEq<Rhs> {
  /**
   * This method returns an ordering between `this` and `other` values if one exists.
   * 
   * ### Examples
  ```ts
  import { Ordering } from "std/cmp";
  
  $assertEq($cmp(1,2), Ordering.Less);

  $assertEq($cmp(1,1), Ordering.Equal);
  
  $assertEq($cmp(2,1), Ordering.Greater);
  ```
   * When comparison is impossible:
  ```ts
  $assertEq($cmp(NaN,1), None());
  ```
   */
  partialCmp(other: Rhs): Option<Ordering>;
}



