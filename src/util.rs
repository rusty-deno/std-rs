

use wasm_bindgen::prelude::*;

use std::{
  mem,
  thread::{
    Thread as InnerThread,
    JoinHandle as JoinInner
  }
};


type Handler=JoinInner<()>;



#[wasm_bindgen]
pub struct JoinHandle {
  inner: Handler
}

impl From<Handler> for JoinHandle {
  fn from(inner: Handler)-> JoinHandle {
    JoinHandle { inner }
  }
}


#[wasm_bindgen]
impl JoinHandle {
  #[wasm_bindgen]
  pub fn is_finished(&self)-> bool {
    self.inner.is_finished()
  }

  #[wasm_bindgen]
  pub unsafe fn thread(&self)-> Thread {
    self.inner.thread().clone().into()
  }

  #[wasm_bindgen]
  pub fn join(self) {
    self.inner.join().unwrap_throw()
  }
}

#[wasm_bindgen]
pub struct Thread {
  inner: InnerThread
}

impl From<InnerThread> for Thread {
  fn from(inner: InnerThread)-> Self {
    Self { inner }
  }
}

#[wasm_bindgen]
impl Thread {
  #[wasm_bindgen]
  pub fn thread_name(&self)-> Option<String> {
    self.inner
    .name()
    .map(|name| name.to_owned())
  }

  #[wasm_bindgen]
  pub unsafe fn id(&self)-> u64 {
    mem::transmute(self.inner.id())
  }

  #[wasm_bindgen]
  pub fn unpark(&self) {
    self.inner.unpark();
  }
}





