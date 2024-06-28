

#[macro_export]
macro_rules! fn_ptr {
  ($fn_ptr:ident)=> {
    unsafe {
      std::mem::transmute::<_,_>($fn_ptr)
    }
  }
}

#[macro_export]
macro_rules! as_ptr {
  ($x:expr)=> {
    Box::into_raw(Box::new($x))
  };
}


#[macro_export]
macro_rules! thread_ptr {
  ($thread:expr)=> {
    Arc::into_raw(
      mem::transmute::<_,Arc<_>>(
        $thread.clone()
      )
    )
  };
}

#[macro_export]
macro_rules! nullable {
  ($x:expr)=> {
    match $x {
      Some(element)=> element,
      None=> JsValue::NULL
    }
  };
}

#[macro_export]
macro_rules! constraints {
  ($i:expr => $gt:expr)=> {
    0<$i || $crate::saturation_cast($i)<$gt
  };
}


#[macro_export]
macro_rules! abs_index {
  ($i:expr ; $cap:expr)=> {
    if $i<0 {
      $i+=$cap as isize;
    }
  };
}

#[macro_export]
macro_rules! checked_idx {
  ($index:expr;$len:expr => $f:expr)=> {
    match $crate::constraints!($index => $len) {
      true=> $f,
      _=> JsValue::NULL
    }
  };
}

#[macro_export]
macro_rules! js_enum {
  ($($member:ident=$val:literal),*)=> {
    $(
      const $member: u8=$val;
    )*
  }
}

#[macro_export]
macro_rules! call {
  ($f:ident($arg0:expr,$arg1:expr,$arg2:expr))=> {
    wasm_bindgen::UnwrapThrowExt::unwrap_throw(
      $f.call3(&wasm_bindgen::JsValue::UNDEFINED,$arg0,$arg1,$arg2)
    )
  };
  ($f:ident($arg0:expr,$arg1:expr))=> {
    wasm_bindgen::UnwrapThrowExt::unwrap_throw(
      $f.call2(&wasm_bindgen::JsValue::UNDEFINED,$arg0,$arg1)
    )
  };
  ($f:ident($arg0:expr))=> {
    wasm_bindgen::UnwrapThrowExt::unwrap_throw(
      $f.call1(&wasm_bindgen::JsValue::UNDEFINED,$arg0)
    )
  };
  ($f:expr)=> {
    wasm_bindgen::UnwrapThrowExt::unwrap_throw(
      $f.call0(&wasm_bindgen::JsValue::UNDEFINED)
    )
  };
}


#[macro_export]
macro_rules! ordering {
  ($int:expr)=> {
    match $int as _ {
      1.. => std::cmp::Ordering::Greater,
      0=> std::cmp::Ordering::Equal,
      _ => std::cmp::Ordering::Less,
    }
  }
}


#[macro_export]
macro_rules! chunks_to_slice {
  ($slice:expr)=> {
    unsafe {
      mem::transmute::<_,Slice>(Box::into_raw(
        $slice
        .collect::<Box<[_]>>()
      ))
    }
  };
}




