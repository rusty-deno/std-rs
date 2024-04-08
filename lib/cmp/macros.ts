// deno-lint-ignore-file no-explicit-any
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
  return lhs===(rhs as unknown) || $partialEq(lhs,rhs) || ((
    lhs instanceof Map && rhs instanceof Map?
      mapEq
    : lhs instanceof Set && rhs instanceof Set?
      setEq
    : lhs instanceof Array && rhs instanceof Array?
      arrayEq
    : objectEq
  ) as (lhs: any,rhs: any)=> boolean)(lhs,rhs);
}




/**
 * Checks whether {@linkcode obj} implements {@linkcode PartailEq}.
 */
export function $implsPartialEq(obj: any): obj is PartailEq<any> {
  return typeof obj.eq==="function";
}

/** Checks equality of two object by value */
function $partialEq(lhs: any,rhs: any): boolean {
  return ($implsPartialEq(lhs) && lhs.eq(rhs)) || ($implsPartialEq(rhs) && rhs.eq(lhs));
}

function mapEq<K,V>(lhs: Map<K,V>,rhs: Map<K,V>) {
  for(const [key,val] of lhs) {
    if(!$eq(rhs.get(key),val)) return false;
  }
  return true;
}

function setEq<T>(lhs: Set<T>,rhs: Set<T>) {
  for(const element of lhs) {
    if(!rhs.has(element)) return false;
  }
  return true;
}

function arrayEq<T>(lhs: T[],rhs: T[]) {
  if(lhs.length!==rhs.length) return false;

  for(let i=0;i<lhs.length;i++) {
    if(!$eq(lhs[i],rhs[i])) return false;
  }

  return true;
}

function objectEq<T extends object>(lhs: any,rhs: any) {
  const lhsEntries=Object.entries(lhs);
  const rhsEntries=Object.entries(rhs);

  for(const sym of Object.getOwnPropertySymbols(lhs)) {
    if(!$eq(lhs[sym],rhs[sym])) return false;
  }

  return arrayEq(lhsEntries,rhsEntries);
}



