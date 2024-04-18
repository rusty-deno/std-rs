import { Enum } from "../types.ts";


/**
 * An Ordering is the result of a comparison between two values.
 * 
 * ### Examples
```ts
import { Ordering } from "std/cmp";

$assertEq($cmp("a","xd"), Ordering.Less);

$assertEq($cmp("xd","xd"), Ordering.Equal);

$assertEq($cmp("xd","a"), Ordering.Greater);
```
 */
export type Ordering=-1|0|1;
export const Ordering={
  /** An ordering where a compared value is less than another. */
  Less: -1,
  /** An ordering where a compared value is equal to another. */
  Equal: 0,
  /** An ordering where a compared value is greater than another. */
  Greater: 1,
} satisfies Enum<Ordering>;






