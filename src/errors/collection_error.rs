
use wasm_bindgen::prelude::*;
use crate::error_kind;


#[wasm_bindgen(module="/lib/collections/error.ts")]
extern "C" {
  pub type CollectionError;

  #[wasm_bindgen(constructor)]
  pub fn new(kind: u8,error: JsError,cause: Option<String>)-> CollectionError;

  #[wasm_bindgen(method)]
  pub fn kind(this: &CollectionError)-> u8;
}

impl CollectionError {
  #[inline(always)]
  pub fn index_out_of_bounds()-> Self {
    Self::new(error_kind::INDEX_OUT_OF_BOUNDS,JsError::new("index out of bounds"),Some("index out of bounds".to_owned()))
  }

  #[inline(always)]
  pub fn capacity_overflow()-> Self {
    Self::new(error_kind::CAPACITY_OVERFLOW,JsError::new("capacity overflow"),Some("maximum capacity overflowed".to_owned()))
  }
}


