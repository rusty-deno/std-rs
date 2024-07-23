
use macros::method;

use js_sys::{
  Function,
  wasm_bindgen::{
    JsValue,
    UnwrapThrowExt
  }
};


use tokio::io::{
  ReadBuf,
  AsyncRead
};

use std::{
  pin::Pin,
  task::{
    Poll,
    Context
  },
  io::{
    self,
    Read
  }
};



pub struct AsyncReader {
  this: JsValue,
  read: Function
}

impl AsyncRead for AsyncReader {
  fn poll_read(self: Pin<&mut Self>,cx: &mut Context<'_>,buf: &mut ReadBuf<'_>,)-> Poll<io::Result<()>> {
    todo!()
  }
}

impl AsyncReader {
  #[inline]
  fn new(this: JsValue,read: Function)-> Self {
    Self {
      read,
      this
    }
  }

  async fn read_to_end(self,buf: &mut Vec<u8>)-> io::Result<usize> {
    todo!()
  }
}



pub struct Reader {
  this: JsValue,
  read: Function
}

impl Reader {
  #[inline]
  fn new(this: JsValue,read: Function)-> Self {
    Self {
      read,
      this
    }
  }
}

impl Read for Reader {
  fn read(&mut self,buf: &mut [u8])-> io::Result<usize> {
    todo!()
  }
}


#[method]
pub fn read_to_end(this: &mut Vec<u8>,read: Function)-> usize {
  todo!()
}

#[method]
pub fn read_to_end_sync(this: &mut Vec<u8>,reader: JsValue,read: Function)-> usize {
  todo!()
}


