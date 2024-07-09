
use wasm_bindgen::JsValue;


pub trait Throwable<T> {
  fn or_throw(self,exception: impl Into<JsValue>)-> T;
}

impl<T> Throwable<T> for Option<T> {
  fn or_throw(self,exception: impl Into<JsValue>)-> T {
    match self {
      Some(val)=> val,
      _=> wasm_bindgen::throw_val(exception.into())
    }
  }
}

impl<T,E> Throwable<T> for Result<T,E> {
  fn or_throw(self,exception: impl Into<JsValue>)-> T {
    match self {
      Ok(res)=> res,
      _=> wasm_bindgen::throw_val(exception.into())
    }
  }
}

