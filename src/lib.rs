
#[macro_use]
mod macros;

use wasm_bindgen::prelude::*;

use std::thread::{
  self,
  JoinHandle
};


type Handler=*mut JoinHandle<()>;

#[wasm_bindgen]
pub fn spawn(ptr: *const u8)-> Handler {
  as_ptr! {
    thread::spawn(fn_ptr!(ptr))
  }
}

#[wasm_bindgen]
/// This function takes ownership of `this`
pub fn join(this: Handler) {
  deref!(this)
  .join()
  .unwrap_throw();
}

