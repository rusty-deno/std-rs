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
    : $isTypedBuf(lhs) && $isTypedBuf(rhs)?
      typedBufEq
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

// deno-lint-ignore no-unused-vars
function $isArrayBuf(buf: any): buf is ArrayBufferLike {
  return buf instanceof ArrayBuffer || buf instanceof SharedArrayBuffer;
}

type TypedArray=Uint8Array|Uint16Array|Uint32Array|Int8Array|Int16Array|Int32Array|BigInt64Array|BigUint64Array|Float32Array|Float64Array;
function $isTypedBuf(buf: any): buf is TypedArray {
  return buf.buffer instanceof ArrayBuffer && Boolean(buf.byteOffset) && Boolean(buf.byteLength);
}


function mapEq<K,V>(lhs: Map<K,V>,rhs: Map<K,V>): boolean {
  for(const [key,val] of lhs) {
    if(!$eq(rhs.get(key),val)) return false;
  }
  return true;
}

function setEq<T>(lhs: Set<T>,rhs: Set<T>): boolean {
  for(const element of lhs) {
    if(!rhs.has(element)) return false;
  }
  return true;
}

function arrayEq<T>(lhs: ArrayLike<T>,rhs: ArrayLike<T>): boolean {
  if(lhs.length!==rhs.length) return false;

  for(let i=0;i<lhs.length;i++) {
    if(!$eq(lhs[i],rhs[i])) return false;
  }

  return true;
}

function objectEq(lhs: any,rhs: any): boolean {
  const lhsEntries=Object.entries(lhs);
  const rhsEntries=Object.entries(rhs);

  for(const sym of Object.getOwnPropertySymbols(lhs)) {
    if(!$eq(lhs[sym],rhs[sym])) return false;
  }

  return arrayEq(lhsEntries,rhsEntries);
}

function typedBufEq(lhs: TypedArray,rhs: TypedArray): boolean {
  return lhs.BYTES_PER_ELEMENT===rhs.BYTES_PER_ELEMENT && arrayEq<number|bigint>(lhs,rhs);
}




