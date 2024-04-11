
use macros::method;
use wasm_bindgen::prelude::*;

type Vector=*mut Vec<JsValue>;
const INDEX_OUT_OF_BOUNDS: &str="Index out of bounds.";


const fn saturation_cast(x: isize)-> usize {
  if x<0 {
    0usize
  } else {
    x as _
  }
}


#[wasm_bindgen]
pub fn new_vec()-> Vector {
  as_ptr!(Vec::new())
}

#[wasm_bindgen]
pub fn new_vec_with_capacity(capacity: isize)-> Vector {
  as_ptr!(Vec::with_capacity(capacity.unsigned_abs()))
}

#[wasm_bindgen]
pub fn vec_from_iter(vec: Vec<JsValue>)-> Vector {
  as_ptr!(vec)
}



#[method]
pub fn push(this: &mut Vec<JsValue>,element: JsValue) {
  if isize::MAX==this.capacity() as _ {
    drop(element);
    return;
  }

  this.push(element);
}

#[method]
pub fn pop(this: &mut Vec<JsValue>)-> JsValue {
  nullable!(this.pop())
}

#[method]
pub fn vec_at(this: &Vec<JsValue>,mut index: isize)-> JsValue {
  abs_index!(index;this.len());

  nullable!(this.get(index as usize).cloned())
}

#[method]
pub fn vec_len(this: &Vec<JsValue>)-> usize {
  this.len()
}

#[method]
pub fn vec_capacity(this: &Vec<JsValue>)-> usize {
  this.capacity()
}

#[method]
pub fn vec_index(this: &Vec<JsValue>,i: isize)-> JsValue {
  if constraints!(i => this.len()) {
    wasm_bindgen::throw_str(INDEX_OUT_OF_BOUNDS)
  }

  this.get(i as usize).unwrap_throw().clone()
}

#[method]
pub fn vec_set(this: &mut Vec<JsValue>,index: isize,element: JsValue) {
  if constraints!(index => this.capacity()) {
    drop(element);
    wasm_bindgen::throw_str(INDEX_OUT_OF_BOUNDS);
  }

  this[index as usize]=element;
}


#[method]
pub fn vec_splice(this: &mut Vec<JsValue>,mut start: isize,count: isize,replace_with: Vec<JsValue>)-> Vector {
  abs_index!(start;this.len());
  let range=start as _..saturation_cast(count-1);

  match this.len() {
    0=> as_ptr!(this.drain(range).collect()),
    _=> as_ptr!(this.splice(range,replace_with).collect())
  }
}

#[method]
pub fn vec_split_off(this: &mut Vec<JsValue>,mut at: isize)-> Vector {
  abs_index!(at;this.len());

  as_ptr!(this.split_off(at as _))
}

#[method]
pub unsafe fn vec_append(this: &mut Vec<JsValue>,other: *mut Vec<JsValue>) {
  this.append(other.as_mut().unwrap());
}

#[method]
pub fn vec_empty(this: &mut Vec<JsValue>) {
  this.clear();
}

#[method]
pub fn vec_insert(this: &mut Vec<JsValue>,mut i: isize,element: JsValue) {
  abs_index!(i;this.len());

  this.insert(i as _,element);
}

#[method]
pub fn vec_remove(this: &mut Vec<JsValue>,mut index: isize)-> JsValue {
  abs_index!(index;this.len());

  this.remove(index as _)
}

#[method]
pub fn vec_shrink_to(this: &mut Vec<JsValue>,min_capacity: isize) {
  this.shrink_to(min_capacity.unsigned_abs())
}

#[method]
pub fn vec_swap(this: &mut Vec<JsValue>,mut a: isize,mut b: isize) {
  abs_index!(a;this.len());
  abs_index!(b;this.len());

  this.swap(a as _,b as _)
}

#[method]
pub fn vec_swap_remove(this: &mut Vec<JsValue>,mut index: isize) {
  abs_index!(index;this.len());

  this.swap_remove(index as _);
}




#[wasm_bindgen]
pub unsafe fn drop_vec(ptr: Vector) {
  drop(Box::from_raw(ptr))
}

