
use std::mem;
use macros::method;
use wasm_bindgen::prelude::*;

use js_sys::{
  Array,
  Function,
  Iterator as JsIterator
};

use crate::{
  Slice,
  cast_or,
  Throwable,
  error_kind::*,
  saturation_cast,
  errors::collection_error::*
};


type U8Vec=*mut Vec<u8>;

#[wasm_bindgen]
pub fn new_u8_vec()-> U8Vec {
  as_ptr!(Vec::new())
}

#[wasm_bindgen]
pub fn new_u8_vec_with_capacity(capacity: isize)-> U8Vec {
  if capacity>isize::MAX {
    throw!(capacity_overflow)
  }

  as_ptr!(Vec::with_capacity(capacity.unsigned_abs()))
}

#[wasm_bindgen]
pub fn u8_vec_from_iter(iter: JsIterator,size_hint: Option<usize>)-> U8Vec {
  let mut buf=Vec::with_capacity(size_hint.unwrap_or_default());

  buf.extend(
    iter.into_iter()
    .map::<u8,_>(|element| dyn_cast!(element))
  );

  as_ptr!(buf)
}

#[wasm_bindgen]
pub fn u8_vec_from_jsarr(arr: Array)-> U8Vec {
  let mut buf=Vec::with_capacity(arr.length() as _);

  buf.extend(
    arr.into_iter()
    .map::<u8,_>(|element| element.unchecked_into_f64() as _)
  );

  as_ptr!(buf)
}

#[wasm_bindgen]
pub fn u8_vec_from_uint8array(vec: Vec<u8>)-> U8Vec {
  as_ptr!(vec)
}

//A

#[method]
pub unsafe fn u8_vec_append(this: &mut Vec<u8>,other: *mut Vec<u8>)-> u8 {
  let other=other.as_mut().unwrap_throw();
  if this.capacity()+other.capacity()>isize::MAX as usize {
    CAPACITY_OVERFLOW
  } else {
    this.append(other);
    OK
  }
}


#[method]
pub fn u8_vec_at(this: &Vec<u8>,mut index: isize)-> Option<u8> {
  abs_index!(index;this.len());
  this.get(index as usize).cloned()
}

#[method]
pub fn u8_vec_as_slice(this: &mut Vec<u8>)-> Slice {
  this.as_slice().into()
}



// B

#[method]
pub fn u8_vec_binary_search_by(this: &Vec<u8>,f: Function)-> Result<usize,usize> {
  this.binary_search_by(|element| ordering!(
    call!{ f(&JsValue::from(*element)) }
    .unchecked_into_f64()
  ))
}

// C


#[method]
pub fn u8_vec_capacity(this: &Vec<u8>)-> usize {
  this.capacity()
}

#[method]
pub fn u8_vec_chunks_by(this: &mut Vec<u8>,f: Function)-> Slice {
  chunks_to_slice! {
    this.chunk_by_mut(|x,y| call! { f(&JsValue::from(*x),&JsValue::from(*y)) }.is_truthy())
  }
}

#[method]
pub fn u8_vec_chunks(this: &mut Vec<u8>,chunk_size: isize)-> Slice {
  chunks_to_slice!{
    this.chunks_mut(chunk_size.unsigned_abs())
  }
}

#[method]
pub fn u8_vec_chunks_exact(this: &mut Vec<u8>,chunk_size: isize)-> Slice {
  chunks_to_slice! {
    this.chunks_exact_mut(chunk_size.unsigned_abs())
  }
}

#[method]
pub fn u8_vec_contains(this: &mut Vec<u8>,element: u8)-> bool {
  this.contains(&element)
}

#[method]
pub fn u8_vec_clear(this: &mut Vec<u8>) {
  this.clear();
}

// D

#[method]
pub fn u8_vec_dedup(this: &mut Vec<u8>,f: Function) {
  this.dedup_by(|a,b| call! { f(&JsValue::from(*a),&JsValue::from(*b)) }.is_truthy())
}


#[method]
pub fn u8_vec_fill(this: &mut Vec<u8>,element: u8) {
  this.fill(element);
}

#[method]
pub fn u8_vec_fill_with(this: &mut Vec<u8>,f: Function) {
  this.fill_with(|| call!(f).unchecked_into_f64() as _)
}

#[method]
pub fn u8_vec_first(this: &mut Vec<u8>)-> Option<u8> {
  this.first_mut().cloned()
}

// I

#[method]
pub fn u8_vec_index(this: &Vec<u8>,i: isize)-> u8 {
  this.get(i as usize)
  .cloned()
  .or_throw(CollectionError::index_out_of_bounds())
}

#[method]
pub fn u8_vec_insert(this: &mut Vec<u8>,mut i: isize,element: u8) {
  abs_index!(i;this.len());

  match constraints!(i => this.len()) {
    true=> this.insert(i as _,element),
    _=> throw!(index_out_of_bounds)
  }
}


// L

#[method]
pub fn u8_vec_last(this: &mut Vec<u8>)-> Option<u8> {
  this.last_mut().cloned()
}

#[method]
pub fn u8_vec_len(this: &Vec<u8>)-> usize {
  this.len()
}


// P

#[method]
pub fn u8_vec_partition_point(this: &mut Vec<u8>,f: Function)-> usize {
  this.partition_point(|element| call! { f(&JsValue::from(*element)) }.is_truthy())
}

#[method]
pub fn u8_vec_push(this: &mut Vec<u8>,element: u8) {
  match this.capacity()==isize::MAX as _ {
    true=> throw!(capacity_overflow),
    _=> this.push(element)
  }
}

#[method]
pub fn u8_vec_push_front(this: &mut Vec<u8>,element: u8) {
  match (this.len(),this.capacity()) {
    (_,0x7fffffff)=> throw!(capacity_overflow),
    (0,_)=> this.push(element),
    _=> this.insert(0,element)
  }
}

#[method]
pub fn u8_vec_pop(this: &mut Vec<u8>)-> Option<u8> {
  this.pop()
}

#[method]
pub fn u8_vec_pop_front(this: &mut Vec<u8>)-> Option<u8> {
  match this.len() {
    0=> None,
    _=> Some(this.remove(0))
  }
}


// R

#[method]
pub fn u8_vec_rchunks(this: &mut Vec<u8>,chunk_size: isize)-> Slice {
  chunks_to_slice! {
    this.rchunks_mut(chunk_size.unsigned_abs())
  }
}

#[method]
pub fn u8_vec_rchunks_exact(this: &mut Vec<u8>,chunk_size: isize)-> Slice {
  chunks_to_slice! {
    this.rchunks_exact_mut(chunk_size.unsigned_abs())
  }
}


#[method]
pub fn u8_vec_remove(this: &mut Vec<u8>,index: isize)-> Option<u8> {
  match constraints!(index => this.len()) {
    true=> Some(this.remove(index as _)),
    _=> None
  }
}

#[method]
pub fn u8_vec_reserve(this: &mut Vec<u8>,additional: isize) {
  this.try_reserve(saturation_cast(additional))
  .or_throw(CollectionError::capacity_overflow())
}

#[method]
pub fn u8_vec_reserve_exact(this: &mut Vec<u8>,additional: isize) {
  this.try_reserve_exact(saturation_cast(additional))
  .or_throw(CollectionError::capacity_overflow())
}

#[method]
pub fn u8_vec_resize(this: &mut Vec<u8>,new_len: isize,val: u8) {
  this.resize(saturation_cast(new_len),val)
}

#[method]
pub fn u8_vec_resize_with(this: &mut Vec<u8>,new_len: isize,f: Function) {
  this.resize_with(saturation_cast(new_len),|| call!(f).unchecked_into_f64() as _)
}

#[method]
pub fn u8_vec_retain(this: &mut Vec<u8>,f: Function) {
  this.retain_mut(|element| call!(f(&JsValue::from(*element))).is_truthy())
}

#[method]
pub fn u8_vec_reverse(this: &mut Vec<u8>) {
  this.reverse()
}

#[method]
pub fn u8_vec_rotate_left(this: &mut Vec<u8>,mid: isize) {
  let mid=cast_or(mid,this.len());
  this.rotate_left(mid);
}

#[method]
pub fn u8_vec_rotate_right(this: &mut Vec<u8>,k: isize) {
  let k=cast_or(k,this.len());
  this.rotate_right(k)
}

#[method]
pub fn u8_vec_rsplit(this: &mut Vec<u8>,f: Function)-> Slice {
  chunks_to_slice! {
    this.rsplit_mut(|element| call! { f(&JsValue::from(*element)) }.is_truthy())
  }
}

#[method]
pub fn u8_vec_rsplitn(this: &mut Vec<u8>,mut n: isize,f: Function)-> U8Vec {
  abs_index!(n;this.len());

  as_ptr!(
    this.rsplitn_mut(
      saturation_cast(n),
      |element| call! { f(&JsValue::from(*element)) }.is_truthy()
    ).collect::<Vec<_>>()
  ) as _
}


// S

#[method]
pub fn u8_vec_set(this: &mut Vec<u8>,index: isize,element: u8) {
  match constraints!(index => this.len()) {
    true=> this[index as usize]=element,
    _=> wasm_bindgen::throw_val(CollectionError::index_out_of_bounds().into())
  }
}


#[method]
pub fn u8_vec_splice_arr(this: &mut Vec<u8>,mut start: isize,count: isize,replace_with: Vec<u8>)-> U8Vec {
  abs_index!(start;this.len());
  let range=start as _..saturation_cast(count-1);

  match this.len() {
    0=> as_ptr!(this.drain(range).collect()),
    _=> as_ptr!(this.splice(range,replace_with).collect())
  }
}

#[wasm_bindgen]
pub unsafe fn u8_vec_splice_u8_vec(this: *mut Vec<u8>,start: isize,count: isize,replace_with: *mut Vec<u8>)-> U8Vec {
  u8_vec_splice_arr(this,start,count,replace_with.as_mut().unwrap_throw().clone())
}


#[method]
pub fn u8_vec_split_off(this: &mut Vec<u8>,mut at: isize)-> U8Vec {
  abs_index!(at;this.len());

  match constraints!(at => this.len()) {
    true=> as_ptr!(this.split_off(at as _)),
    _=> throw!(index_out_of_bounds)
  }
}

#[method]
pub fn u8_vec_shrink_to(this: &mut Vec<u8>,min_capacity: isize) {
  this.shrink_to(min_capacity.unsigned_abs())
}

#[method]
pub fn u8_vec_shrink_to_fit(this: &mut Vec<u8>) {
  this.shrink_to_fit()
}

#[method]
pub fn u8_vec_sort_by(this: &mut Vec<u8>,f: Function) {
  this.sort_by(|a,b| ordering!(
    call!{ f(&JsValue::from(*a),&JsValue::from(*b)) }
    .unchecked_into_f64()
  ))
}

#[method]
pub fn u8_vec_sort_unstable_by(this: &mut Vec<u8>,f: Function) {
  this.sort_unstable_by(|a,b| ordering!(
    call! { f(&JsValue::from(*a),&JsValue::from(*b)) }
    .unchecked_into_f64()
  ))
}

#[method]
pub fn u8_vec_split(this: &mut Vec<u8>,f: Function)-> Slice {
  chunks_to_slice! {
    this.split_mut(|element| call! { f(&JsValue::from(*element)) }.is_truthy())
  }
}

#[method]
pub fn u8_vec_split_at(this: &mut Vec<u8>,mut mid: isize)-> Vec<Slice> {
  abs_index!(mid;this.len());
  let (split0,split1)=this.split_at_mut(mid as _);
  
  vec![split0.into(),split1.into()]
}

#[method]
pub fn u8_vec_splitn(this: &mut Vec<u8>,n: isize,f: Function)-> Slice {
  chunks_to_slice! {
    this.splitn_mut(n.unsigned_abs(),|element| call! { f(&JsValue::from(*element)) }.is_truthy())
  }
}

#[method]
pub fn u8_vec_swap(this: &mut Vec<u8>,a: isize,b: isize) {
  let len=this.len();

  match constraints!(a => len) || constraints!(b => len) {
    true=> this.swap(saturation_cast(a),saturation_cast(b)),
    _=> throw!(capacity_overflow)
  }
}

#[method]
pub fn u8_vec_swap_remove(this: &mut Vec<u8>,index: isize)-> Option<u8> {
  match constraints!(index => this.len()) {
    true=> Some(this.swap_remove(index as _)),
    _=> None
  }
}

// SAFETY: This function is only used inside the `Vec` class and not exposed to the user.
#[method]
pub unsafe fn u8_vec_swap_with_slice(this: &mut Vec<u8>,ptr: *mut u8,len: usize) {
  this.swap_with_slice(std::slice::from_raw_parts_mut(ptr,len));
}

#[method]
pub fn u8_vec_truncate(this: &mut Vec<u8>,len: isize) {
  this.truncate(len.unsigned_abs())
}

// W

#[method]
pub fn u8_vec_windows(this: &mut Vec<u8>,size: isize)-> Slice {
  chunks_to_slice! {
    this.windows(size.unsigned_abs())
  }
}


#[wasm_bindgen]
pub unsafe fn drop_u8_vec(ptr: U8Vec) {
  drop(Box::from_raw(ptr))
}


macros::typed_array! {
  
}

