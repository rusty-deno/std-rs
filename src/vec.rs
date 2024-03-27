

use macros::method;
use wasm_bindgen::prelude::*;

type Vector=*mut Vec<JsValue>;

#[wasm_bindgen]
pub fn new_vec()-> Vector {
  as_ptr!(Vec::new())
}

#[wasm_bindgen]
pub fn new_vec_with_capacity(capacity: usize)-> Vector {
  as_ptr!(Vec::with_capacity(capacity))
}

#[wasm_bindgen]
pub fn vec_from_iter(vec: Vec<JsValue>)-> Vector {
  as_ptr!(vec)
}



#[method]
pub fn push(this: &mut Vec<JsValue>,element: JsValue) {
  this.push(element);
}

#[method]
pub fn pop(this: &mut Vec<JsValue>)-> JsValue {
  nullable!(this.pop())
}

#[method]
pub fn vec_at(this: &Vec<JsValue>,i: usize)-> JsValue {
  match this.get(i) {
    Some(element)=> element.clone(),
    _=> JsValue::NULL
  }
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
pub fn vec_index(this: &Vec<JsValue>,i: usize)-> JsValue {
  this.get(i).unwrap_throw().clone()
}

#[method]
pub fn vec_splice(this: &mut Vec<JsValue>,start: usize,end: usize,replace_with: Vec<JsValue>)-> Vec<JsValue> {
  this.splice(start..end,replace_with).collect()
}

#[method]
pub fn vec_split_off(this: &mut Vec<JsValue>,at: usize)-> Vec<JsValue> {
  this.split_off(at)
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
pub fn vec_insert(this: &mut Vec<JsValue>,index: usize,element: JsValue) {
  this.insert(index,element);
}

#[method]
pub fn vec_remove(this: &mut Vec<JsValue>,index: usize)-> JsValue {
  this.remove(index)
}

#[method]
pub fn vec_shrink_to(this: &mut Vec<JsValue>,min_capacity: usize) {
  this.shrink_to(min_capacity)
}

#[method]
pub fn vec_swap(this: &mut Vec<JsValue>,a: usize,b: usize) {
  this.swap(a,b)
}

#[method]
pub fn vec_swap_remove(this: &mut Vec<JsValue>,index: usize) {
  this.swap_remove(index);
}




#[wasm_bindgen]
pub unsafe fn drop_vec(ptr: Vector) {
  drop(Box::from_raw(ptr))
}

