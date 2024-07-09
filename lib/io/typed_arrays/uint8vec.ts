


import { ArrayLite } from '../../types.ts';
import { Clone } from '../../clone.ts';
import { PartailEq,$eq } from '../../cmp/mod.ts';
import * as lib from "../../../bindings/std_rs.js";
import { Option,Result,Ok,Err } from "../../error/mod.ts";
import { $todo } from "../../declarative-macros/panics.ts";
import { IntoIterator,IteratorTrait } from '../../iter/iter.ts';
import { Extend } from '../../iter/extend.ts';
import { Vec } from "../../../mod.ts";
import { CollectionError,CollectionErrorKind } from "../../collections/error.ts";


type Equivalent=Vec<number>|number[]|Uint8Vec|Uint8Array|Uint8ClampedArray;


function isNum(p: PropertyKey): p is number {
  return typeof p==="string" && Number(p)==p as unknown;
}


// TODO(kakashi): implement Drop trait using decorator
export class Uint8Vec extends IntoIterator<number> implements Clone,PartailEq<Equivalent>,ArrayLite<number>,Extend<number> {
  #ptr: number;
  [index: number]: number;

  constructor(...elements: number[]) {
    super();
    this.#ptr=elements.length>0?lib.u8_vec_from_iter(new Uint8Array(elements)):lib.new_vec();

    return new Proxy<Uint8Vec>(this,Uint8Vec.#handler);
  }

  public static withCapacity(capacity: number): Uint8Vec {
    return Uint8Vec.fromPtr(lib.new_u8_vec_with_capacity(capacity));
  }

  public static from(iter: Iterable<number>): Uint8Vec {
    return iter instanceof Uint8Vec?iter:new Uint8Vec(...iter);
  }

  static #handler: ProxyHandler<Uint8Vec>={
    get(self: Uint8Vec,p) {
      return isNum(p)?lib.u8_vec_index(self.#ptr,p):self[p as unknown as keyof typeof self];
    },
    set(self,index,val): boolean {
      return isNum(index) && !lib.u8_vec_set(self.#ptr,index,val);
    },
    deleteProperty(self,index) {
      return isNum(index) && !lib.u8_vec_set(self.#ptr,index,0);
    },
  };

  private static fromPtr(ptr: number): Uint8Vec {
    const self=new Uint8Vec();

    lib.drop_u8_vec(self.#ptr);
    self.#ptr=ptr;

    return self;
  }

  public get length(): number {
    return lib.u8_vec_len(this.#ptr);
  }
  
  public get capacity(): number {
    return lib.u8_vec_capacity(this.#ptr);
  }

  *[Symbol.iterator](): Iterator<number> {
    // SAFETY: This never throws an exception as the loop runs within the bound.
    for(let i=0;i<this.length;i++) yield lib.vec_index(this.#ptr,i);
  }

  public eq(rhs: Equivalent): boolean {
    if(this.length !== rhs.length) return false;
    if(rhs instanceof Uint8Vec && this.#ptr === rhs.#ptr) return true;

    for(const [a,b] of this.iter().zip(rhs)) {
      if(!$eq(a,b)) return false;
    }

    return true;
  }

  public extend(iter: Iterable<number>) {
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


  public iter(): IteratorTrait<number> {
    return $todo();
  }

  public at(index: number): Option<number> {
    return new Option(lib.vec_at(this.#ptr,index) as number|null);
  }

  public set(index: number,element: number): Result<void,CollectionError> {
    return lib.vec_set(this.#ptr,index,element)?
      Err(new CollectionError(CollectionErrorKind.IndexOutOfBounds,"index out of bounds"))
    :
      Ok(undefined as void);
  }

  public push(element: number) {
    if(lib.vec_push(this.#ptr,element)) throw new CollectionError(CollectionErrorKind.CapacityOverflow,"Exceeded maximux capacity");
  }

  public pushFront(element: number) {
    if(lib.vec_push_front(this.#ptr,element)) throw new CollectionError(CollectionErrorKind.CapacityOverflow,"Exceeded maximux capacity");
  }

  public pop(): Option<number> {
    return new Option(lib.vec_pop(this.#ptr) as number|null);
  }

  public popFront(): Option<number> {
    return new Option(lib.vec_pop_front(this.#ptr) as number|null);
  }

  public splice(start: number,end: number,replaceWith: Equivalent=[]): Uint8Vec {
    return Uint8Vec.fromPtr(
      replaceWith instanceof Uint8Vec?
        lib.vec_splice_vec(this.#ptr,start,end,replaceWith.#ptr)
      :
        lib.u8_vec_splice_arr(this.#ptr,start,end,new Uint8Array(replaceWith))
    );
  }

  public splitOff(at: number): Uint8Vec {
    try {
      return Uint8Vec.fromPtr(lib.vec_split_off(this.#ptr,at));
    } catch {
      // lol..xd never thought I'd write this..
      throw new CollectionError(CollectionErrorKind.IndexOutOfBounds,"index out of bounds");
    }
  }

  public append(other: Equivalent) {
    if(lib.vec_append(this.#ptr,Uint8Vec.from(other).#ptr)) throw new CollectionError(CollectionErrorKind.CapacityOverflow,"Exceeded maximux capacity");
  }

  public clear() {
    lib.vec_clear(this.#ptr);
  }

  public insert(index: number,element: number) {
    if(lib.vec_insert(this.#ptr,index,element)) throw new CollectionError(CollectionErrorKind.IndexOutOfBounds,"index out of bounds");
  }

  public remove(index: number): Option<number> {
    return new Option(lib.vec_remove(this.#ptr,index) as number|null);
  }

  public shrinkTo(minCapacity: number) {
    lib.vec_shrink_to(this.#ptr,minCapacity);
  }

  public swap(start: number,end: number) {
    if(lib.vec_swap(this.#ptr,start,end)) throw new CollectionError(CollectionErrorKind.IndexOutOfBounds,"index out of bounds");
  }

  public swapRemove(index: number): Option<number> {
    return new Option(lib.vec_swap_remove(this.#ptr,index) as number|null);
  }

  public clone(): this {
    const clone=Uint8Vec.withCapacity(this.capacity);
    // SAFETY: This never throws an exception as the loop runs within the bound.
    for(let i=0;i<this.length;i++) this.push(structuredClone(lib.vec_index(this.#ptr,i)));

    return clone as this;
  }
}





