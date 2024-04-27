import { ArrayLite, Fn } from '../../types.ts';
import { Clone } from '../../clone.ts';
import { PartailEq,$eq } from '../../cmp/mod.ts';
import * as lib from "../../../bindings/std_rs.js";
import { Option,Result,Ok,Err } from "../../error/mod.ts";
import { $todo } from "../../declarative-macros/panics.ts";
import { IntoIterator,IteratorTrait } from '../../iter/iter.ts';
import { Extend } from '../../iter/extend.ts';

type Equivalent<T>=Vec<T>|T[];


function isNum(p: PropertyKey): p is number {
  return typeof p==="string" && Number(p)==p as unknown;
}


const INDEX_OUT_OF_BOUNDS="Index out of bounds";
const EXCEEDED_MAX_CAPACITY="Exceeded max capacity";


// TODO(kakashi): implement Drop trait using decorator
export class Vec<T> extends IntoIterator<T> implements Clone,PartailEq<Equivalent<T>>,ArrayLite<T>,Extend<T> {
  #ptr: number;
  [index: number]: T;

  constructor(...elements: T[]) {
    super();
    this.#ptr=elements.length>0?lib.vec_from_iter(elements):lib.new_vec();

    return new Proxy<Vec<T>>(this,Vec.#handler);
  }

  public static withCapacity<T>(capacity: number): Vec<T> {
    return Vec.fromPtr<T>(lib.new_vec_with_capacity(capacity));
  }

  public static from<T>(iter: Iterable<T>): Vec<T> {
    return iter instanceof Vec?iter:new Vec(...iter);
  }

  static #handler: ProxyHandler<Vec<unknown>>={
    get(self: Vec<unknown>,p) {
      return isNum(p)?lib.vec_index(self.#ptr,p):self[p as unknown as keyof typeof self];
    },
    set(self,index,val): boolean {
      return isNum(index) && !lib.vec_set(self.#ptr,index,val);
    },
    deleteProperty(self,index) {
      return isNum(index) && !lib.vec_set(self.#ptr,index,null);
    },
  };

  private static fromPtr<T>(ptr: number): Vec<T> {
    const self=new Vec<T>();

    lib.drop_vec(self.#ptr);
    self.#ptr=ptr;

    return self;
  }

  public get length(): number {
    return lib.vec_len(this.#ptr);
  }
  
  public get capacity(): number {
    return lib.vec_capacity(this.#ptr);
  }

  *[Symbol.iterator](): Iterator<T> {
    // SAFETY: This never throws an exception as the loop runs within the bound.
    for(let i=0;i<this.length;i++) yield lib.vec_index(this.#ptr,i);
  }

  public eq(rhs: Equivalent<T>): boolean {
    if(this.length !== rhs.length) return false;
    if(rhs instanceof Vec && this.#ptr === rhs.#ptr) return true;

    for(const [a,b] of this.iter().zip(rhs)) {
      if(!$eq(a,b)) return false;
    }

    return true;
  }

  public extend(iter: Iterable<T>) {
    // deno-lint-ignore no-explicit-any
    const _iter=iter as any;
    const additional: number|null=typeof _iter.length==="number"?
      _iter.length
    : typeof _iter.size==="number"?
      _iter.size
    : typeof _iter.len==="number"?
      _iter.len
    :
      null;
    additional && lib.vec_reserve(this.#ptr,additional);

    for(const element of iter) {
      this.push(element);
    }
  }


  public iter(): IteratorTrait<T> {
    return $todo();
  }

  public at(index: number): Option<T> {
    return new Option(lib.vec_at(this.#ptr,index) as T|null);
  }

  public set(index: number,element: T): Result<void,string> {
    return lib.vec_set(this.#ptr,index,element)?Err(INDEX_OUT_OF_BOUNDS):Ok(undefined as void);
  }

  public push(element: T) {
    if(lib.vec_push(this.#ptr,element)) throw EXCEEDED_MAX_CAPACITY;
  }

  public pushFront(element: T) {
    if(lib.vec_push_front(this.#ptr,element)) throw EXCEEDED_MAX_CAPACITY;
  }

  public pop(): Option<T> {
    return new Option(lib.vec_pop(this.#ptr) as T|null);
  }

  public popFront(): Option<T> {
    return new Option(lib.vec_pop_front(this.#ptr) as T|null);
  }

  public splice(start: number,end: number,replaceWith: Equivalent<T>=[]): Vec<T> {
    return Vec.fromPtr<T>(
      replaceWith instanceof Vec?
        lib.vec_splice_vec(this.#ptr,start,end,replaceWith.#ptr)
      :
        lib.vec_splice_arr(this.#ptr,start,end,replaceWith)
    );
  }

  public splitOff(at: number): Vec<T> {
    try {
      return Vec.fromPtr<T>(lib.vec_split_off(this.#ptr,at));
    } catch {
      // lol..xd never thought I'd write this..
      throw INDEX_OUT_OF_BOUNDS;
    }
  }

  public append(other: Equivalent<T>) {
    if(lib.vec_append(this.#ptr,Vec.from<T>(other).#ptr)) throw EXCEEDED_MAX_CAPACITY;
  }

  public clear() {
    lib.vec_clear(this.#ptr);
  }

  public insert(index: number,element: T) {
    if(lib.vec_insert(this.#ptr,index,element)) throw INDEX_OUT_OF_BOUNDS;
  }

  public remove(index: number): Option<T> {
    return new Option(lib.vec_remove(this.#ptr,index) as T|null);
  }

  public shrinkTo(minCapacity: number) {
    lib.vec_shrink_to(this.#ptr,minCapacity);
  }

  public swap(start: number,end: number) {
    if(lib.vec_swap(this.#ptr,start,end)) INDEX_OUT_OF_BOUNDS;
  }

  public swapRemove(index: number): Option<T> {
    return new Option(lib.vec_swap_remove(this.#ptr,index) as T|null);
  }

  public map<U>(f: Fn<[T,number],U>): Vec<U> {
    const mapped=Vec.withCapacity<U>(this.length);

    let i=0;
    for(const element of this) {
      lib.vec_push(mapped.#ptr,f(element,i++));
    }

    return mapped;
  }

  public clone(): Vec<T> {
    const clone=Vec.withCapacity<T>(this.capacity);
    // SAFETY: This never throws an exception as the loop runs within the bound.
    for(let i=0;i<this.length;i++) this.push(structuredClone(lib.vec_index(this.#ptr,i)));

    return clone;
  }
}



