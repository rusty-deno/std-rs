

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
  ($i:expr => $gteq:expr)=> {
    $i<0 || $i>=$gteq as isize
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
