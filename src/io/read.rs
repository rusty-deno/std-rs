
use macros::method;
use wasm_bindgen_futures::{future_to_promise, JsFuture};


use js_sys::{
  Promise,
  Function,
  Uint8Array,
  wasm_bindgen::{
    JsValue,
    UnwrapThrowExt
  }
};


use tokio::io::{
  ReadBuf,
  AsyncRead,
  AsyncReadExt
};

use std::{
  future::Future, io::{
    self,
    Read
  }, mem, pin::Pin, task::{
    Context, Poll
  }
};

use crate::UnwrapExt;




pub struct AsyncReader {
  this: JsValue,
  read: Function
}

impl AsyncRead for AsyncReader {
  fn poll_read(self: Pin<&mut Self>,cx: &mut Context<'_>,buf: &mut ReadBuf<'_>,)-> Poll<io::Result<()>> {
    let buf=unsafe { Uint8Array::view(std::mem::transmute(buf.inner_mut())) };
    let res=self.read.call1(&self.this,&buf).unwrap_or_throw();
    let mut future=JsFuture::from(Promise::from(res));
    let poll=JsFuture::poll(Pin::new(&mut future),cx);

    poll.map(|res| {
      res.unwrap_or_throw();
      Ok(())
    })
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
  #[inline]
  fn read(&mut self,buf: &mut [u8])-> io::Result<usize> {
    let buf=unsafe { Uint8Array::view(buf) };
    Ok(
      self.read.call1(&self.this,&buf)
      .unwrap_or_throw()
      .unchecked_into_f64() as _
    )
  }
}


#[method]
pub unsafe fn read_to_end(this: &mut Vec<u8>,reader: JsValue,read: Function)-> Promise {
  future_to_promise(async {
    match AsyncReader::new(reader,read).read_to_end(this).await {
      Ok(res)=> Ok(JsValue::from(res as u32)),
      Err(err)=> Err(mem::transmute::<_,u8>(err.kind()).into())
    }
  })
}

#[method]
pub fn read_to_end_sync(this: &mut Vec<u8>,reader: JsValue,read: Function)-> usize {
  Reader::new(reader,read)
  .read_to_end(this)
  .unwrap_throw()
}


