
use macros::method;
use wasm_bindgen::prelude::*;

type Vector=*mut Vec<JsValue>;


js_enum! {
  OK=0,
  INDEX_OUT_OF_BOUNDS=1,
  EXCEEDED_MAX_CAPACITY=2
}



const fn saturation_cast(x: isize)-> usize {
  if x<0 {
    0usize
  } else {
    x as _
  }
}


#[wasm_bindgen]
pub fn new_vec()-> Vector {
  as_ptr!(Vec::new())
}

#[wasm_bindgen]
pub fn new_vec_with_capacity(capacity: isize)-> Vector {
  as_ptr!(Vec::with_capacity(capacity.unsigned_abs()))
}

#[wasm_bindgen]
pub fn vec_from_iter(vec: Vec<JsValue>)-> Vector {
  as_ptr!(vec)
}



#[method]
pub fn vec_push(this: &mut Vec<JsValue>,element: JsValue)-> u8 {
  match this.capacity()==isize::MAX as _ {
    true=> {
      drop(element);
      EXCEEDED_MAX_CAPACITY
    }
    _=> {
      this.push(element);
      OK
    }
  }
}

#[method]
pub fn vec_push_front(this: &mut Vec<JsValue>,element: JsValue)-> u8 {
  match (this.len(),this.capacity()) {
    (_,0x7fffffff)=> {
      drop(element);
      return EXCEEDED_MAX_CAPACITY;
    }
    (0,_)=> this.push(element),
    _=> this.insert(0,element)
  }
  OK
}

#[method]
pub fn vec_pop(this: &mut Vec<JsValue>)-> JsValue {
  nullable!(this.pop())
}

#[method]
pub fn vec_pop_front(this: &mut Vec<JsValue>)-> JsValue {
  match this.len() {
    0=> JsValue::NULL,
    _=> this.remove(0)
  }
}


#[method]
pub fn vec_at(this: &Vec<JsValue>,mut index: isize)-> JsValue {
  abs_index!(index;this.len());

  nullable!(this.get(index as usize).cloned())
}

#[method]
pub fn vec_len(this: &Vec<JsValue>)-> usize {
  this.len()
}

#[method]
pub fn vec_capacity(this: &Vec<JsValue>)-> usize {
  this.capacity()
}

#[method]
pub fn vec_index(this: &Vec<JsValue>,i: isize)-> JsValue {
  if constraints!(i => this.len()) {
    wasm_bindgen::throw_val(INDEX_OUT_OF_BOUNDS.into())
  }

  this.get(i as usize).unwrap_throw().clone()
}

#[method]
pub fn vec_set(this: &mut Vec<JsValue>,index: isize,element: JsValue)-> u8 {
  match constraints!(index => this.capacity()) {
    true=> {
      this[index as usize]=element;
      OK
    },
    _=> {
      drop(element);
      INDEX_OUT_OF_BOUNDS
    }
  }
}


#[method]
pub fn vec_splice(this: &mut Vec<JsValue>,mut start: isize,count: isize,replace_with: Vec<JsValue>)-> Vector {
  abs_index!(start;this.len());
  let range=start as _..saturation_cast(count-1);

  match this.len() {
    0=> as_ptr!(this.drain(range).collect()),
    _=> as_ptr!(this.splice(range,replace_with).collect())
  }
}

#[method]
pub fn vec_split_off(this: &mut Vec<JsValue>,mut at: isize)-> Vector {
  abs_index!(at;this.len());

  match constraints!(at => this.len()) {
    true=> as_ptr!(this.split_off(at as _)),
    _=> wasm_bindgen::throw_val(INDEX_OUT_OF_BOUNDS.into())
  }
}

#[method]
pub unsafe fn vec_append(this: &mut Vec<JsValue>,other: *mut Vec<JsValue>)-> u8 {
  let other=other.as_mut().unwrap();
  if this.capacity()+other.capacity()>isize::MAX as usize {
    EXCEEDED_MAX_CAPACITY
  } else {
    this.append(other);
    OK
  }
}

#[method]
pub fn vec_clear(this: &mut Vec<JsValue>) {
  this.clear();
}

#[method]
pub fn vec_insert(this: &mut Vec<JsValue>,mut i: isize,element: JsValue)-> u8 {
  abs_index!(i;this.len());

  match constraints!(i => this.len()) {
    true=> {
      this.insert(i as _,element);
      OK
    },
    _=> {
      drop(element);
      INDEX_OUT_OF_BOUNDS
    }
  }
}

#[method]
pub fn vec_remove(this: &mut Vec<JsValue>,index: isize)-> JsValue {
  checked_idx!{
    index;this.len() => this.remove(index as _)
  }
}

#[method]
pub fn vec_shrink_to(this: &mut Vec<JsValue>,min_capacity: isize) {
  this.shrink_to(min_capacity.unsigned_abs())
}

#[method]
pub fn vec_swap(this: &mut Vec<JsValue>,a: isize,b: isize)-> u8 {
  let len=this.len();

  match constraints!(a => len) || constraints!(b => len) {
    true=> {
      this.swap(a as _,b as _);
      OK
    },
    _=> INDEX_OUT_OF_BOUNDS
  }
}

#[method]
pub fn vec_swap_remove(this: &mut Vec<JsValue>,index: isize)-> JsValue {
  checked_idx! {
    index;this.len() => this.swap_remove(index as _)
  }
}






#[wasm_bindgen]
pub unsafe fn drop_vec(ptr: Vector) {
  drop(Box::from_raw(ptr))
}

