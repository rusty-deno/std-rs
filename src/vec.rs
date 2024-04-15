
use macros::method;
use wasm_bindgen::prelude::*;

type Vector=*mut Vec<JsValue>;


js_enum! {
  OK=0,
  INDEX_OUT_OF_BOUNDS=1,
  CAPACITY_OVERFLOW=2
}


const fn saturation_cast(x: isize)-> usize {
  if x<0 {
    0usize
  } else {
    x as _
  }
}

const fn cast_or(int: isize,or: usize)-> usize {
  if int<0 || int as usize>or {
    or
  } else {
    int as _
  }
}



fn any(val: Result<JsValue,JsValue>)-> JsValue {
  match val {
    Ok(val)=> val,
    Err(err)=> err
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
      CAPACITY_OVERFLOW
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
      return CAPACITY_OVERFLOW;
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
pub fn vec_splice_arr(this: &mut Vec<JsValue>,mut start: isize,count: isize,replace_with: Vec<JsValue>)-> Vector {
  abs_index!(start;this.len());
  let range=start as _..saturation_cast(count-1);

  match this.len() {
    0=> as_ptr!(this.drain(range).collect()),
    _=> as_ptr!(this.splice(range,replace_with).collect())
  }
}

#[wasm_bindgen]
pub unsafe fn vec_splice_vec(this: *mut Vec<JsValue>,start: isize,count: isize,replace_with: *mut Vec<JsValue>)-> Vector {
  vec_splice_arr(this,start,count,replace_with.as_mut().unwrap().clone())
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
    CAPACITY_OVERFLOW
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
pub fn vec_reserve(this: &mut Vec<JsValue>,additional: isize)-> u8 {
  match this.try_reserve(saturation_cast(additional)) {
    Ok(_)=> OK,
    _=> CAPACITY_OVERFLOW
  }
}

#[method]
pub fn vec_reserve_exact(this: &mut Vec<JsValue>,additional: isize)-> u8 {
  match this.try_reserve_exact(saturation_cast(additional)) {
    Ok(_)=> OK,
    _=> CAPACITY_OVERFLOW
  }
}

#[method]
pub fn vec_resize(this: &mut Vec<JsValue>,new_len: isize,val: JsValue) {
  this.resize(saturation_cast(new_len),val)
}

#[method]
pub fn vec_resize_with(this: &mut Vec<JsValue>,new_len: isize,f: js_sys::Function) {
  this.resize_with(saturation_cast(new_len),|| any(f.call0(&JsValue::NULL)))
}

#[method]
pub fn vec_retain(this: &mut Vec<JsValue>,f: js_sys::Function) {
  this.retain_mut(|elem| any(f.call1(&JsValue::NULL,elem)).is_truthy())
}

#[method]
pub fn vec_reverse(this: &mut Vec<JsValue>) {
  this.reverse()
}

#[method]
pub fn vec_rotate_left(this: &mut Vec<JsValue>,mid: isize) {
  let mid=cast_or(mid,this.len());
  this.rotate_left(mid);
}

#[method]
pub fn vec_rotate_right(this: &mut Vec<JsValue>,k: isize) {
  let k=cast_or(k,this.len());
  this.rotate_right(k)
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

