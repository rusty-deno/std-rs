
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
  }
};


type HandlerPtr=*mut JoinHandle<()>;
type Handler=JoinHandle<()>;


#[wasm_bindgen]
pub fn spawn_thread(ptr: *const u8)-> HandlerPtr {
  as_ptr! {
    thread::spawn(fn_ptr!(ptr))
  }
}

#[method]
pub fn join_handler(this: Handler) {
  this.join().unwrap_throw();
}

#[method]
pub fn handler_thread(_this: &Handler) {
  unimplemented!()
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


