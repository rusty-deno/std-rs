

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


