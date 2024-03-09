

#[macro_export]
macro_rules! fn_ptr {
  ($fn_ptr:ident)=> {
    unsafe {
      std::mem::transmute::<_,fn()-> ()>($fn_ptr)
    }
  }
}

#[macro_export]
macro_rules! as_ptr {
  ($x:expr)=> {
    Box::into_raw(Box::new($x))
  };
}


