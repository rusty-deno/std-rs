
#[macro_use]
mod util_macro;

use macros::method;
use wasm_bindgen::prelude::*;

use std::{
  mem,
  thread::{
    self,
    JoinHandle,
    Thread
  },
  time::Duration
};


type HandlerPtr=*mut JoinHandle<()>;
type Handler=JoinHandle<()>;


#[wasm_bindgen]
pub fn spawn_thread(ptr: *const u8)-> HandlerPtr {
  as_ptr! {
    thread::spawn(fn_ptr!(ptr))
  }
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
  as_ptr!(thread::current())
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

#[method]
pub fn join_handler(this: Handler) {
  this.join().unwrap_throw();
}

#[method]
pub fn handler_thread(this: &Handler)-> *const Thread {
  this.thread() as *const _
}

#[method]
pub fn task_is_finished(this: &mut Handler)-> bool {
  this.is_finished()
}

#[method]
pub fn thread_name(this: &mut Thread)-> Option<String> {
  this.name()
  .map(|name| name.to_owned())
}

#[method]
pub unsafe fn thread_id(this: &mut Thread)-> u64 {
  mem::transmute(this.id())
}

#[method]
pub fn thread_unpark(this: &mut Thread) {
  this.unpark()
}



