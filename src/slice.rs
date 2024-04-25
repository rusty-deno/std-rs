
use std::mem;
use wasm_bindgen::prelude::*;


#[wasm_bindgen]
pub struct Slice {
  pub ptr: usize,
  pub len: usize
}



impl<S: AsRef<[JsValue]>> From<S> for Slice {
  fn from(slice: S)-> Self {
    // SAFETY: This operation is safe as Slice and &[JsValue] have the same layout in memory
    unsafe {
      mem::transmute(slice.as_ref())
    }
  }
}





