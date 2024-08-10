
use wasm_bindgen::JsValue;


pub trait Throwable<T> {
  fn or_throw(self,exception: impl Into<JsValue>)-> T;
}

pub trait UnwrapExt<T,E>: Throwable<T> {
  fn unwrap_or_throw(self)-> T;
}

impl<T> Throwable<T> for Option<T> {
  #[inline]
  fn or_throw(self,exception: impl Into<JsValue>)-> T {
    match self {
      Some(val)=> val,
      _=> wasm_bindgen::throw_val(exception.into())
    }
  }
}

impl<T> UnwrapExt<T,JsValue> for Option<T> {
  #[inline]
  fn unwrap_or_throw(self)-> T {
    match self {
      Some(val)=> val,
      _=> wasm_bindgen::throw_val(JsValue::null())
    }
  }
}


impl<T,E: Into<JsValue>> UnwrapExt<T,E> for Result<T,E> {
  #[inline]
  fn unwrap_or_throw(self)-> T {
    match self {
      Ok(res)=> res,
      Err(err)=> wasm_bindgen::throw_val(err.into())
    }
  }
}

impl<T,E> Throwable<T> for Result<T,E> {
  #[inline]
  fn or_throw(self,exception: impl Into<JsValue>)-> T {
    match self {
      Ok(res)=> res,
      _=> wasm_bindgen::throw_val(exception.into())
    }
  }
}
