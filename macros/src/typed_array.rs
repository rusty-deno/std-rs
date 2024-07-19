
use quote::ToTokens;
use proc_macro2::Span;
use proc_macro::TokenStream;

use syn::{
  Type,
  FnArg,
  Ident
};


#[inline]
fn js_arr_name(ty: &Type)-> &'static str {
  match ty.to_token_stream().to_string().as_str() {
    "u8"=> "Uint8Array",
    "u16"=> "Uint16Array",
    "u32"=> "Uint32Array",
    "u64"=> "BigUint64Array",
    "i8"=> "Int8Array",
    "i16"=> "Int16Array",
    "i32"=> "Int32Array",
    "i64"=> "BigInt64Array",
    "f32"=> "Float32Array",
    "f64"=> "Float64Array",
    _=> unreachable!()
  }
}


pub fn typed_array_impl(arg: FnArg)-> TokenStream {
  let arg=match arg {
    FnArg::Typed(args)=> args,
    _=> unreachable!()
  };
  let ty=arg.ty;
  let name=syn::parse::<Ident>(arg.pat.into_token_stream().into()).unwrap();
  let js_name=Ident::new(js_arr_name(&ty),Span::call_site());

  quote::quote! {
    type #name=*mut Vec<#ty>;

    #[macros::mangle_name(#ty)]
    #[wasm_bindgen::prelude::wasm_bindgen]
    pub fn new_vec()-> #name {
      as_ptr!(Vec::new())
    }
    
    #[macros::mangle_name(#ty)]
    #[wasm_bindgen::prelude::wasm_bindgen]
    pub fn new_vec_with_capacity(capacity: isize)-> #name {
      if capacity>isize::MAX {
        throw!(capacity_overflow)
      }
    
      as_ptr!(Vec::with_capacity(capacity.unsigned_abs()))
    }
    
    #[macros::mangle_name(#ty)]
    #[wasm_bindgen::prelude::wasm_bindgen]
    pub fn vec_from_iter(iter: js_sys::Iterator,size_hint: Option<usize>)-> #name {
      let mut buf=Vec::with_capacity(size_hint.unwrap_or_default());
    
      buf.extend(
        iter.into_iter()
        .map::<#ty,_>(|element| dyn_cast!(element))
      );
    
      as_ptr!(buf)
    }
    
    #[macros::mangle_name(#ty)]
    #[wasm_bindgen::prelude::wasm_bindgen]
    pub fn vec_from_jsarr(arr: js_sys::Array)-> #name {
      let mut buf=Vec::with_capacity(arr.length() as _);
    
      buf.extend(
        arr.into_iter()
        .map::<#ty,_>(|element| element.unchecked_into_f64() as _)
      );
    
      as_ptr!(buf)
    }
    
    #[macros::mangle_name(#ty)]
    #[wasm_bindgen::prelude::wasm_bindgen]
    pub fn vec_from_uint8array(vec: Vec<#ty>)-> #name {
      as_ptr!(vec)
    }
    
    //A
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub unsafe fn vec_append(this: &mut Vec<#ty>,other: *mut Vec<#ty>) {
      let other=wasm_bindgen::UnwrapThrowExt::unwrap_throw(other.as_mut());

      match this.capacity()+other.capacity()>isize::MAX as usize {
        true=> throw!(capacity_overflow),
        _=> this.append(other)
      }
    }
    
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_at(this: &Vec<#ty>,mut index: isize)-> Option<#ty> {
      abs_index!(index;this.len());
      this.get(index as usize).cloned()
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_as_slice(this: &mut Vec<#ty>)-> crate::Slice {
      this.as_slice().into()
    }
    
    
    
    // B
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_binary_search_by(this: &Vec<#ty>,f: js_sys::Function)-> Result<usize,usize> {
      this.binary_search_by(|element| ordering!(
        call!{ f(&wasm_bindgen::JsValue::from(*element)) }
        .unchecked_into_f64()
      ))
    }
    
    // C
    
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_capacity(this: &Vec<#ty>)-> usize {
      this.capacity()
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_chunks_by(this: &mut Vec<#ty>,f: js_sys::Function)-> crate::Slice {
      chunks_to_slice! {
        this.chunk_by_mut(|x,y| call! { f(&wasm_bindgen::JsValue::from(*x),&wasm_bindgen::JsValue::from(*y)) }.is_truthy())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_chunks(this: &mut Vec<#ty>,chunk_size: isize)-> crate::Slice {
      chunks_to_slice!{
        this.chunks_mut(chunk_size.unsigned_abs())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_chunks_exact(this: &mut Vec<#ty>,chunk_size: isize)-> crate::Slice {
      chunks_to_slice! {
        this.chunks_exact_mut(chunk_size.unsigned_abs())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_contains(this: &mut Vec<#ty>,element: #ty)-> bool {
      this.contains(&element)
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_clear(this: &mut Vec<#ty>) {
      this.clear();
    }
    
    // D
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_dedup(this: &mut Vec<#ty>,f: js_sys::Function) {
      this.dedup_by(|a,b| call! { f(&wasm_bindgen::JsValue::from(*a),&wasm_bindgen::JsValue::from(*b)) }.is_truthy())
    }
    
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_fill(this: &mut Vec<#ty>,element: #ty) {
      this.fill(element);
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_fill_with(this: &mut Vec<#ty>,f: js_sys::Function) {
      this.fill_with(|| call!(f).unchecked_into_f64() as _)
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_first(this: &mut Vec<#ty>)-> Option<#ty> {
      this.first_mut().cloned()
    }
    
    // I
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_index(this: &Vec<#ty>,i: isize)-> #ty {
      crate::Throwable::or_throw(this.get(i as usize).cloned(),crate::errors::collection_error::CollectionError::index_out_of_bounds())
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_insert(this: &mut Vec<#ty>,mut i: isize,element: #ty) {
      abs_index!(i;this.len());
    
      match constraints!(i => this.len()) {
        true=> this.insert(i as _,element),
        _=> throw!(index_out_of_bounds)
      }
    }
    
    
    // L
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_last(this: &mut Vec<#ty>)-> Option<#ty> {
      this.last_mut().cloned()
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_len(this: &Vec<#ty>)-> usize {
      this.len()
    }
    
    
    // P
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_partition_point(this: &mut Vec<#ty>,f: js_sys::Function)-> usize {
      this.partition_point(|element| call! { f(&wasm_bindgen::JsValue::from(*element)) }.is_truthy())
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_push(this: &mut Vec<#ty>,element: #ty) {
      match this.capacity()==isize::MAX as _ {
        true=> throw!(capacity_overflow),
        _=> this.push(element)
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_push_front(this: &mut Vec<#ty>,element: #ty) {
      match (this.len(),this.capacity()) {
        (_,0x7fffffff)=> throw!(capacity_overflow),
        (0,_)=> this.push(element),
        _=> this.insert(0,element)
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_pop(this: &mut Vec<#ty>)-> Option<#ty> {
      this.pop()
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_pop_front(this: &mut Vec<#ty>)-> Option<#ty> {
      match this.len() {
        0=> None,
        _=> Some(this.remove(0))
      }
    }
    
    
    // R
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_rchunks(this: &mut Vec<#ty>,chunk_size: isize)-> crate::Slice {
      chunks_to_slice! {
        this.rchunks_mut(chunk_size.unsigned_abs())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_rchunks_exact(this: &mut Vec<#ty>,chunk_size: isize)-> crate::Slice {
      chunks_to_slice! {
        this.rchunks_exact_mut(chunk_size.unsigned_abs())
      }
    }
    
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_remove(this: &mut Vec<#ty>,index: isize)-> Option<#ty> {
      match constraints!(index => this.len()) {
        true=> Some(this.remove(index as _)),
        _=> None
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_reserve(this: &mut Vec<#ty>,additional: isize) {
      crate::Throwable::or_throw(this.try_reserve(crate::saturating_cast(additional)),crate::errors::collection_error::CollectionError::capacity_overflow())
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_reserve_exact(this: &mut Vec<#ty>,additional: isize) {
      crate::Throwable::or_throw(this.try_reserve_exact(crate::saturating_cast(additional)),crate::errors::collection_error::CollectionError::capacity_overflow())
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_resize(this: &mut Vec<#ty>,new_len: isize,val: #ty) {
      this.resize(crate::saturating_cast(new_len),val)
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_resize_with(this: &mut Vec<#ty>,new_len: isize,f: js_sys::Function) {
      this.resize_with(crate::saturating_cast(new_len),|| call!(f).unchecked_into_f64() as _)
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_retain(this: &mut Vec<#ty>,f: js_sys::Function) {
      this.retain_mut(|element| call!(f(&wasm_bindgen::JsValue::from(*element))).is_truthy())
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_reverse(this: &mut Vec<#ty>) {
      this.reverse()
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_rotate_left(this: &mut Vec<#ty>,mid: isize) {
      let mid=crate::cast_or(mid,this.len());
      this.rotate_left(mid);
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_rotate_right(this: &mut Vec<#ty>,k: isize) {
      let k=crate::cast_or(k,this.len());
      this.rotate_right(k)
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_rsplit(this: &mut Vec<#ty>,f: js_sys::Function)-> crate::Slice {
      chunks_to_slice! {
        this.rsplit_mut(|element| call! { f(&wasm_bindgen::JsValue::from(*element)) }.is_truthy())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_rsplitn(this: &mut Vec<#ty>,mut n: isize,f: js_sys::Function)-> #name {
      abs_index!(n;this.len());
    
      as_ptr!(
        this.rsplitn_mut(
          crate::saturating_cast(n),
          |element| call! { f(&wasm_bindgen::JsValue::from(*element)) }.is_truthy()
        ).collect::<Vec<_>>()
      ) as _
    }
    
    
    // S
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_set(this: &mut Vec<#ty>,index: isize,element: #ty) {
      match constraints!(index => this.len()) {
        true=> this[index as usize]=element,
        _=> wasm_bindgen::throw_val(crate::errors::collection_error::CollectionError::index_out_of_bounds().into())
      }
    }
    
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_splice_arr(this: &mut Vec<#ty>,mut start: isize,count: isize,replace_with: Vec<#ty>)-> #name {
      abs_index!(start;this.len());
      let range=start as _..crate::saturating_cast(count-1);
    
      match this.len() {
        0=> as_ptr!(this.drain(range).collect()),
        _=> as_ptr!(this.splice(range,replace_with).collect())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub unsafe fn vec_splice_vec(this: &mut Vec<#ty>,mut start: isize,count: isize,replace_with: *mut Vec<#ty>)-> #name {
      let replace_with=wasm_bindgen::UnwrapThrowExt::unwrap_throw(replace_with.as_mut()).clone();
      abs_index!(start;this.len());
      let range=start as _..crate::saturating_cast(count-1);
    
      match this.len() {
        0=> as_ptr!(this.drain(range).collect()),
        _=> as_ptr!(this.splice(range,replace_with).collect())
      }
    }

    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_split_off(this: &mut Vec<#ty>,mut at: isize)-> #name {
      abs_index!(at;this.len());
    
      match constraints!(at => this.len()) {
        true=> as_ptr!(this.split_off(at as _)),
        _=> throw!(index_out_of_bounds)
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_shrink_to(this: &mut Vec<#ty>,min_capacity: isize) {
      this.shrink_to(min_capacity.unsigned_abs())
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_shrink_to_fit(this: &mut Vec<#ty>) {
      this.shrink_to_fit()
    }

    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub unsafe fn vec_slice(this: &Vec<#ty>,mut start: isize,mut end: isize)-> js_sys::#js_name {
      let len=this.len();
      abs_index!(start;len);
      abs_index!(end;len);

      js_sys::#js_name::view(&this[start as _..end as _])
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_sort_by(this: &mut Vec<#ty>,f: js_sys::Function) {
      this.sort_by(|a,b| ordering!(
        call!{ f(&wasm_bindgen::JsValue::from(*a),&wasm_bindgen::JsValue::from(*b)) }
        .unchecked_into_f64()
      ))
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_sort_unstable_by(this: &mut Vec<#ty>,f: js_sys::Function) {
      this.sort_unstable_by(|a,b| ordering!(
        call! { f(&wasm_bindgen::JsValue::from(*a),&wasm_bindgen::JsValue::from(*b)) }
        .unchecked_into_f64()
      ))
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_split(this: &mut Vec<#ty>,f: js_sys::Function)-> crate::Slice {
      chunks_to_slice! {
        this.split_mut(|element| call! { f(&wasm_bindgen::JsValue::from(*element)) }.is_truthy())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_split_at(this: &mut Vec<#ty>,mut mid: isize)-> Vec<crate::Slice> {
      abs_index!(mid;this.len());
      let (split0,split1)=this.split_at_mut(mid as _);
      
      vec![split0.into(),split1.into()]
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_splitn(this: &mut Vec<#ty>,n: isize,f: js_sys::Function)-> crate::Slice {
      chunks_to_slice! {
        this.splitn_mut(n.unsigned_abs(),|element| call! { f(&wasm_bindgen::JsValue::from(*element)) }.is_truthy())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_swap(this: &mut Vec<#ty>,a: isize,b: isize) {
      let len=this.len();
    
      match constraints!(a => len) || constraints!(b => len) {
        true=> this.swap(crate::saturating_cast(a),crate::saturating_cast(b)),
        _=> throw!(capacity_overflow)
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_swap_remove(this: &mut Vec<#ty>,index: isize)-> Option<#ty> {
      match constraints!(index => this.len()) {
        true=> Some(this.swap_remove(index as _)),
        _=> None
      }
    }
    
    // SAFETY: This function is only used inside the `Vec` class and not exposed to the user.
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub unsafe fn vec_swap_with_slice(this: &mut Vec<#ty>,ptr: *mut #ty,len: usize) {
      this.swap_with_slice(std::slice::from_raw_parts_mut(ptr,len));
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_truncate(this: &mut Vec<#ty>,len: isize) {
      this.truncate(len.unsigned_abs())
    }
    
    // W
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub fn vec_windows(this: &mut Vec<#ty>,size: isize)-> crate::Slice {
      chunks_to_slice! {
        this.windows(size.unsigned_abs())
      }
    }

    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub unsafe fn view(this: &Vec<#ty>)-> js_sys::#js_name {
      js_sys::#js_name::view(this)
    }
    
    #[macros::mangle_name(#ty)]
    #[wasm_bindgen::prelude::wasm_bindgen]
    pub unsafe fn drop_vec(ptr: #name) {
      drop(Box::from_raw(ptr))
    }

  }.into()
}


