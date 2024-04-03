import { PartailEq } from './eq.ts';

/**
 * Compares two objects by their value.
 * 
 * ### Example
```ts
const xd={ xd: 69 };
const xd1={ xd: 69 };

$assertEq(xd,xd1);
```
 */
export function $eq<Lhs,Rhs>(lhs: Lhs,rhs: Rhs): boolean {
  return lhs===(rhs as unknown) || (
    $implsPartialEq(lhs) ?
      lhs.eq(rhs)
    : $implsPartialEq(rhs)?
      rhs.eq(lhs)
    : JSON.stringify(lhs)===JSON.stringify(rhs)
  );
}


/**
 * Checks whether {@linkcode obj} implements {@linkcode PartailEq}.
 */
// deno-lint-ignore no-explicit-any
export function $implsPartialEq(obj: any): obj is PartailEq<any> {
  return typeof obj.eq==="function";
}

