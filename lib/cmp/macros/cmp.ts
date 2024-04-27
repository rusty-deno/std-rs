import { Ord,PartialOrd,Ordering } from "../ord.ts";
import { Option,None,Some } from '../../error/option/option.ts';


type Order<L,R>=L extends string?R extends string?
  Ordering:Option<Ordering>
: L extends Ord?R extends Ord?
  Ordering:Option<Ordering>
: Option<Ordering>;

/**
 * Compares two values.
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
export function $cmp<Lhs extends Rhs|PartialOrd<Rhs>|(Ord&Rhs),Rhs,Ordering extends Order<Lhs,Rhs>=Order<Lhs,Rhs>>(lhs: Lhs,rhs: Rhs): Ordering {
  switch([typeof lhs,typeof rhs]) {
    case ["number","number"]:
      return lhs as unknown===rhs as unknown?
        Some(0) as Ordering
      : (lhs as unknown as number)>(rhs as unknown as number)?
        Some(1) as Ordering
      : (lhs as unknown as number)<(rhs as unknown as number)?
        Some(-1) as Ordering
      :
        None() as Ordering;
    case ["string","string"]:
      return (lhs as unknown as string).localeCompare(rhs as unknown as string) as Ordering;
    case ["object","object"]:
      return $isOrd(lhs)?lhs.cmp(rhs as Lhs&Ord) as Ordering:(lhs as PartialOrd<Rhs>).partialCmp(rhs) as Ordering;
    default: return None() as Ordering;
  }
}


// deno-lint-ignore no-explicit-any
export function $isOrd(x: any): x is Ord {
  return typeof x.cmp!=="undefined";
}


