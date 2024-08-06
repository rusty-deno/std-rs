
use wasm_bindgen::prelude::*;

use std::{
  mem,
  error::Error as ErrorTrait,
  io::{
    Error,
    ErrorKind
  }
};



#[wasm_bindgen(module="/lib/io/error.ts")]
extern "C" {
  pub type IoError;

  #[wasm_bindgen(constructor)]
  fn _new(kind: u8,error: JsError,cause: Option<String>)-> IoError;

  #[wasm_bindgen(method)]
  fn _kind(this: &IoError)-> u8;
}

impl From<Error> for IoError {
  #[inline]
  fn from(err: Error)-> Self {
    let cause=err.source().map(|e| e.to_string());
    IoError::_new(err.kind() as _,err.into(),cause)
  }
}


impl IoError {
  #[inline]
  pub fn new(kind: ErrorKind,error: JsError,cause: Option<String>)-> Self {
    Self::_new(kind as u8,error,cause)
  }

  #[inline]
  pub fn kind(&self)-> ErrorKind {
    // SAFETY: the js IoErrorKind is identical to std::io::ErrorKind 
    unsafe {
      mem::transmute(self._kind())
    }
  }
}


