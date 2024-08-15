
import { isNum } from "./util.ts";
import { Vec } from "../../../mod.ts";
import { Clone } from '../../clone.ts';
import { PartailEq } from '../../cmp/mod.ts';
import { Extend } from '../../iter/extend.ts';
import { ArrayLite, Fn } from '../../types.ts';
import * as lib from "../../../bindings/std_rs.js";
import { Option,Result } from "../../error/mod.ts";
import { $resultSync } from "../../error/result/macros.ts";
import { $todo } from "../../declarative-macros/panics.ts";
import { CollectionError } from "../../collections/error.ts";
import { IntoIterator,IteratorTrait } from '../../iter/iter.ts';



type Equivalent=Vec<bigint>|bigint[]|Uint64Vec|BigUint64Array;


// TODO(kakashi): implement Drop trait using decorator
export class Uint64Vec extends IntoIterator<bigint> implements Clone,Disposable,PartailEq<Equivalent>,ArrayLite<bigint>,Extend<bigint> {
  #ptr: number;
  [index: number]: bigint;

  constructor(...elements: bigint[]) {
    super();
    this.#ptr=elements.length>0?lib.u64_vec_from_jsarr(elements):lib.u64_new_vec();

    return new Proxy<Uint64Vec>(this,Uint64Vec.#handler);
  }

  public static withCapacity(capacity: number): Uint64Vec {
    return Uint64Vec.fromPtr(lib.u64_new_vec_with_capacity(capacity));
  }

  public static fromBigUint64Array(buf: BigUint64Array): Uint64Vec {
    return Uint64Vec.fromPtr(lib.u64_vec_from_js_typed_array(buf));
  }

  public static from(iter: Iterable<bigint>): Uint64Vec {
    return Uint64Vec.fromPtr(lib.u64_vec_from_iter(iter[Symbol.iterator]()));
  }

  static #handler: ProxyHandler<Uint64Vec>={
    get(self: Uint64Vec,p): bigint {
      return isNum(p)?lib.u64_vec_index(self.#ptr,p):self[p as unknown as keyof typeof self] as bigint;
    },
    set(self,index,val): boolean {
      return isNum(index) && !(lib.u64_vec_set(self.#ptr,index,val) as undefined);
    },
    deleteProperty(self,index): boolean {
      return isNum(index) && !(lib.u64_vec_set(self.#ptr,index,0n) as undefined);
    },
  };

  [Symbol.dispose]() {
    lib.u64_drop_vec(this.#ptr);
  }

  private static fromPtr(ptr: number): Uint64Vec {
    const self=new Uint64Vec();

    lib.u64_drop_vec(self.#ptr);
    self.#ptr=ptr;

    return self;
  }

  public get length(): number {
    return lib.u64_vec_len(this.#ptr);
  }
  
  public get capacity(): number {
    return lib.u64_vec_capacity(this.#ptr);
  }

  public thisPtr(): number {
    return this.#ptr;
  }

  public asPtr(): Deno.PointerValue<bigint> {
    return Deno.UnsafePointer.create(BigInt(this.#ptr));
  }

  *[Symbol.iterator](): Iterator<bigint> {
    // SAFETY: This never throws an exception as the loop runs within the bounds.
    for(let i=0;i<this.length;i++) yield lib.u64_vec_index(this.#ptr,i);
  }

  public eq(rhs: Equivalent): boolean {
    if(this.length !== rhs.length) return false;
    if(this==rhs || rhs instanceof Uint64Vec && this.#ptr === rhs.#ptr) return true;

    for(const [a,b] of this.iter().zip(rhs)) {
      if(a!==b) return false;
    }

    return true;
  }

  public extend(iter: Iterable<bigint>) {
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
    additional && lib.u64_vec_reserve(this.#ptr,additional);

    for(const element of iter) {
      this.push(element);
    }
  }

  public view(): BigUint64Array {
    return lib.u64_view(this.#ptr);
  }

  public iter(): IteratorTrait<bigint> {
    return $todo();
  }

  public at(index: number): Option<bigint> {
    return new Option(lib.u64_vec_at(this.#ptr,index));
  }

  public set(index: number,element: bigint): Result<void,CollectionError> {
    return $resultSync(lib.u64_vec_set,this.#ptr,index,element);
  }

  public push(element: bigint) {
    lib.u64_vec_push(this.#ptr,element);
  }

  public pushFront(element: bigint) {
    lib.u64_vec_push_front(this.#ptr,element);
  }

  public pop(): Option<bigint> {
    return new Option(lib.u64_vec_pop(this.#ptr));
  }

  public popFront(): Option<bigint> {
    return new Option(lib.u64_vec_pop_front(this.#ptr));
  }

  public slice(start: number,end: number=this.length): BigUint64Array {
    return lib.u64_vec_slice(this.#ptr,start,end);
  }

  public splice(start: number,end: number,replaceWith: Equivalent=[]): Uint64Vec {
    return Uint64Vec.fromPtr(
      replaceWith instanceof Uint64Vec?
        lib.u64_vec_splice_vec(this.#ptr,start,end,replaceWith.#ptr)
      :
        lib.u64_vec_splice_arr(this.#ptr,start,end,new BigUint64Array(replaceWith))
    );
  }

  public splitOff(at: number): Uint64Vec {
    return Uint64Vec.fromPtr(lib.u64_vec_split_off(this.#ptr,at));
  }

  public append(other: Equivalent) {
    lib.u64_vec_append(this.#ptr,Uint64Vec.from(other).#ptr);
  }

  public clear() {
    lib.u64_vec_clear(this.#ptr);
  }

  public insert(index: number,element: bigint) {
    lib.u64_vec_insert(this.#ptr,index,element);
  }

  public remove(index: number): Option<bigint> {
    return new Option(lib.u64_vec_remove(this.#ptr,index));
  }

  public reserve(additional: number) {
    lib.u64_vec_reserve(this.#ptr,additional);
  }

  public shrinkTo(minCapacity: number) {
    lib.u64_vec_shrink_to(this.#ptr,minCapacity);
  }

  public spareCapacity(): BigUint64Array {
    const len=this.length;
    return lib.u64_vec_slice(this.#ptr,len,this.capacity-len);
  }

  public swap(start: number,end: number) {
    lib.u64_vec_swap(this.#ptr,start,end);
  }

  public swapRemove(index: number): Option<bigint> {
    return new Option(lib.u64_vec_swap_remove(this.#ptr,index));
  }

  public map<T>(f: Fn<[element: bigint,index: number],T>): Vec<T> {
    const mapped=Vec.withCapacity<T>(this.length);

    let i=0;
    for(const element of this) {
      mapped.push(f(element,i++));
    }

    return mapped;
  }

  public clone(): this {
    const clone=Uint64Vec.withCapacity(this.capacity);
    // SAFETY: This never throws an exception as the loop runs within the bound.
    for(let i=0;i<this.length;i++) this.push(lib.u64_vec_index(this.#ptr,i));

    return clone as this;
  }
}

