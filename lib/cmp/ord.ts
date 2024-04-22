import { Enum } from "../types.ts";
import { Eq,PartailEq } from "./eq.ts";


/**
 * An Ordering is the result of a comparison between two values.
 * 
 * ### Examples
```ts
import { Ordering } from "std/cmp";
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
  cmp(other: this): Ordering;
  partialCmp(other: this): Ordering;
  eq(rhs: this): boolean;
}

export interface PartialOrd<Rhs> extends PartailEq<Rhs> {
  partialCmp(other: Rhs): Ordering;
}



