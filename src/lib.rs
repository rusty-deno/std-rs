
#[macro_use]
mod util_macro;
mod util;

use util::*;
use macros::method;
use wasm_bindgen::prelude::*;

use std::{
  mem,
  sync::Arc,
  time::Duration,
  thread::{
    self,
    Thread
  }
};





#[wasm_bindgen]
pub fn spawn_thread(ptr: *const u8)-> JoinHandle {
  thread::spawn(fn_ptr!(ptr)).into()
}

#[wasm_bindgen]
pub unsafe fn available_parallelism()-> usize {
  mem::transmute(
    thread::available_parallelism()
    .unwrap_throw()
  )
}

#[wasm_bindgen]
pub fn current_thread()-> *mut Thread {
  todo!()
}

#[wasm_bindgen]
pub fn thread_panicking()-> bool {
  thread::panicking()
}

#[wasm_bindgen]
pub fn park_thread() {
  thread::park()
}

#[wasm_bindgen]
pub fn park_thread_with_timeout(dur: u64) {
  thread::park_timeout(Duration::from_millis(dur))
}

#[wasm_bindgen]
pub fn sleep(dur: u64) {
  thread::sleep(Duration::from_millis(dur))
}

#[wasm_bindgen]
pub fn yield_now() {
  thread::yield_now()
}







