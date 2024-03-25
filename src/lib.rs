
#[macro_use]
mod util_macro;
mod vec;
pub use vec::*;


use macros::method;
use wasm_bindgen::prelude::*;


use std::{
  mem,
  sync::Arc,
  time::Duration,
  thread::{
    self,
    Thread,
    Builder,
    JoinHandle
  }
};



type Handler=JoinHandle<()>;



////////////////////
// FREE FUNCTIONS //
////////////////////

#[wasm_bindgen]
pub fn spawn_thread(ptr: *const u8,name: Option<String>)-> *const Handler {
  let builder=match name {
    Some(name)=> Builder::new().name(name),
    _=> Builder::new()
  };

  as_ptr!(
    builder.spawn(fn_ptr!(ptr)).unwrap_throw().into()
  )
}

#[wasm_bindgen]
pub unsafe fn available_parallelism()-> usize {
  mem::transmute(
    thread::available_parallelism()
    .unwrap_throw()
  )
}

#[wasm_bindgen]
pub unsafe fn current_thread()-> *const Thread {
  thread_ptr!(thread::current())
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


// JoinHandle methods

#[method]
pub fn is_finished(this: &Handler)-> bool {
  this.is_finished()
}

#[method]
pub unsafe fn thread(this: &Handler)-> *const Thread {
  thread_ptr!(this.thread())
}

#[method]
pub fn join(this: Handler) {
  this.join().unwrap_throw();
}


// Thread methods

#[method]
pub unsafe fn thread_id(this: &Thread)-> u64 {
  mem::transmute(this.id())
}

#[method]
pub fn thread_unpark(this: &Thread) {
  this.unpark()
}

#[method]
pub fn thread_name(this: &Thread)-> Option<String> {
  this.name()
  .map(|name| name.to_owned())
}


// destructors

#[wasm_bindgen]
pub unsafe fn drop_thread(this_ptr: *const [u8;16]) {
  Arc::from_raw(this_ptr);
}

#[wasm_bindgen]
pub unsafe fn drop_join_handle(this_ptr: *mut Handler) {
  drop(Box::from_raw(this_ptr));
}


