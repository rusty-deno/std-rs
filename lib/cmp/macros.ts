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
  return lhs===(rhs as unknown) || $partialEq(lhs,rhs) || (
    lhs instanceof Map && rhs instanceof Map?
      lhs.size===rhs.size && mapEq(lhs,rhs)
    : lhs instanceof Set && rhs instanceof Set?
      lhs.size===rhs.size && setEq(lhs,rhs)
    : lhs instanceof Array && rhs instanceof Array?
      lhs.length===rhs.length && arrayEq(lhs,rhs)
    : $isTypedBuf(lhs) && $isTypedBuf(rhs)?
      lhs.BYTES_PER_ELEMENT===lhs.BYTES_PER_ELEMENT && lhs.length===rhs.length && arrayEq<number|bigint>(lhs,rhs)
    : $isArrayBuf(lhs) && $isArrayBuf(rhs)?
      lhs.byteLength===rhs.byteLength && arrBufEq(lhs,rhs)
    : objectEq(lhs,rhs)
  );
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

function arrBufEq(lhs: ArrayBufferLike,rhs: ArrayBufferLike) {
  const Constructor=typedBuf(lhs.byteLength%8);
  const lhsBuf=new Constructor(lhs);
  const rhsBuf=new Constructor(rhs);

  return lhsBuf.length===rhsBuf.length && arrayEq<number|bigint>(lhsBuf,rhsBuf);
}

function typedBuf(BYTES_PER_ELEMENT: number) {
  switch(BYTES_PER_ELEMENT) {
    case 0: return BigInt64Array;
    case 4: return Int32Array;
    case 2: return Int16Array;
    default: return Int8Array;
  }
}



