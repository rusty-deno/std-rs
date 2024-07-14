
use quote::ToTokens;
use proc_macro::TokenStream;

use syn::{
  FnArg,
  Ident
};



pub fn typed_array_impl(item: TokenStream)-> TokenStream {
  let args=match syn::parse::<FnArg>(item).unwrap() {
    FnArg::Typed(args)=> args,
    _=> unreachable!()
  };
  let ty=args.ty;
  let name=syn::parse::<Ident>(args.pat.into_token_stream().into()).unwrap();

  // panic!("name: {}\nty: {}\ntype_name: {}",name.to_string(),ty.to_token_stream().to_string(),type_name.to_string());


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
    pub fn vec_from_iter(iter: JsIterator,size_hint: Option<usize>)-> #name {
      let mut buf=Vec::with_capacity(size_hint.unwrap_or_default());
    
      buf.extend(
        iter.into_iter()
        .map::<#ty,_>(|element| dyn_cast!(element))
      );
    
      as_ptr!(buf)
    }
    
    #[macros::mangle_name(#ty)]
    #[wasm_bindgen::prelude::wasm_bindgen]
    pub fn vec_from_jsarr(arr: Array)-> #name {
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
    #[method]
    pub unsafe fn vec_append(this: &mut Vec<#ty>,other: *mut Vec<#ty>) {
      let other=other.as_mut().unwrap_throw();

      match this.capacity()+other.capacity()>isize::MAX as usize {
        true=> throw!(capacity_overflow),
        _=> this.append(other)
      }
    }
    
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_at(this: &Vec<#ty>,mut index: isize)-> Option<#ty> {
      abs_index!(index;this.len());
      this.get(index as usize).cloned()
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_as_slice(this: &mut Vec<#ty>)-> Slice {
      this.as_slice().into()
    }
    
    
    
    // B
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_binary_search_by(this: &Vec<#ty>,f: Function)-> Result<usize,usize> {
      this.binary_search_by(|element| ordering!(
        call!{ f(&JsValue::from(*element)) }
        .unchecked_into_f64()
      ))
    }
    
    // C
    
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_capacity(this: &Vec<#ty>)-> usize {
      this.capacity()
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_chunks_by(this: &mut Vec<#ty>,f: Function)-> Slice {
      chunks_to_slice! {
        this.chunk_by_mut(|x,y| call! { f(&JsValue::from(*x),&JsValue::from(*y)) }.is_truthy())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_chunks(this: &mut Vec<#ty>,chunk_size: isize)-> Slice {
      chunks_to_slice!{
        this.chunks_mut(chunk_size.unsigned_abs())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_chunks_exact(this: &mut Vec<#ty>,chunk_size: isize)-> Slice {
      chunks_to_slice! {
        this.chunks_exact_mut(chunk_size.unsigned_abs())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_contains(this: &mut Vec<#ty>,element: #ty)-> bool {
      this.contains(&element)
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_clear(this: &mut Vec<#ty>) {
      this.clear();
    }
    
    // D
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_dedup(this: &mut Vec<#ty>,f: Function) {
      this.dedup_by(|a,b| call! { f(&JsValue::from(*a),&JsValue::from(*b)) }.is_truthy())
    }
    
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_fill(this: &mut Vec<#ty>,element: #ty) {
      this.fill(element);
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_fill_with(this: &mut Vec<#ty>,f: Function) {
      this.fill_with(|| call!(f).unchecked_into_f64() as _)
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_first(this: &mut Vec<#ty>)-> Option<#ty> {
      this.first_mut().cloned()
    }
    
    // I
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_index(this: &Vec<#ty>,i: isize)-> #ty {
      this.get(i as usize)
      .cloned()
      .or_throw(CollectionError::index_out_of_bounds())
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_insert(this: &mut Vec<#ty>,mut i: isize,element: #ty) {
      abs_index!(i;this.len());
    
      match constraints!(i => this.len()) {
        true=> this.insert(i as _,element),
        _=> throw!(index_out_of_bounds)
      }
    }
    
    
    // L
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_last(this: &mut Vec<#ty>)-> Option<#ty> {
      this.last_mut().cloned()
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_len(this: &Vec<#ty>)-> usize {
      this.len()
    }
    
    
    // P
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_partition_point(this: &mut Vec<#ty>,f: Function)-> usize {
      this.partition_point(|element| call! { f(&JsValue::from(*element)) }.is_truthy())
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_push(this: &mut Vec<#ty>,element: #ty) {
      match this.capacity()==isize::MAX as _ {
        true=> throw!(capacity_overflow),
        _=> this.push(element)
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_push_front(this: &mut Vec<#ty>,element: #ty) {
      match (this.len(),this.capacity()) {
        (_,0x7fffffff)=> throw!(capacity_overflow),
        (0,_)=> this.push(element),
        _=> this.insert(0,element)
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_pop(this: &mut Vec<#ty>)-> Option<#ty> {
      this.pop()
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_pop_front(this: &mut Vec<#ty>)-> Option<#ty> {
      match this.len() {
        0=> None,
        _=> Some(this.remove(0))
      }
    }
    
    
    // R
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_rchunks(this: &mut Vec<#ty>,chunk_size: isize)-> Slice {
      chunks_to_slice! {
        this.rchunks_mut(chunk_size.unsigned_abs())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_rchunks_exact(this: &mut Vec<#ty>,chunk_size: isize)-> Slice {
      chunks_to_slice! {
        this.rchunks_exact_mut(chunk_size.unsigned_abs())
      }
    }
    
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_remove(this: &mut Vec<#ty>,index: isize)-> Option<#ty> {
      match constraints!(index => this.len()) {
        true=> Some(this.remove(index as _)),
        _=> None
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_reserve(this: &mut Vec<#ty>,additional: isize) {
      this.try_reserve(saturation_cast(additional))
      .or_throw(CollectionError::capacity_overflow())
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_reserve_exact(this: &mut Vec<#ty>,additional: isize) {
      this.try_reserve_exact(saturation_cast(additional))
      .or_throw(CollectionError::capacity_overflow())
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_resize(this: &mut Vec<#ty>,new_len: isize,val: #ty) {
      this.resize(saturation_cast(new_len),val)
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_resize_with(this: &mut Vec<#ty>,new_len: isize,f: Function) {
      this.resize_with(saturation_cast(new_len),|| call!(f).unchecked_into_f64() as _)
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_retain(this: &mut Vec<#ty>,f: Function) {
      this.retain_mut(|element| call!(f(&JsValue::from(*element))).is_truthy())
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_reverse(this: &mut Vec<#ty>) {
      this.reverse()
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_rotate_left(this: &mut Vec<#ty>,mid: isize) {
      let mid=cast_or(mid,this.len());
      this.rotate_left(mid);
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_rotate_right(this: &mut Vec<#ty>,k: isize) {
      let k=cast_or(k,this.len());
      this.rotate_right(k)
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_rsplit(this: &mut Vec<#ty>,f: Function)-> Slice {
      chunks_to_slice! {
        this.rsplit_mut(|element| call! { f(&JsValue::from(*element)) }.is_truthy())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_rsplitn(this: &mut Vec<#ty>,mut n: isize,f: Function)-> #name {
      abs_index!(n;this.len());
    
      as_ptr!(
        this.rsplitn_mut(
          saturation_cast(n),
          |element| call! { f(&JsValue::from(*element)) }.is_truthy()
        ).collect::<Vec<_>>()
      ) as _
    }
    
    
    // S
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_set(this: &mut Vec<#ty>,index: isize,element: #ty) {
      match constraints!(index => this.len()) {
        true=> this[index as usize]=element,
        _=> wasm_bindgen::throw_val(CollectionError::index_out_of_bounds().into())
      }
    }
    
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_splice_arr(this: &mut Vec<#ty>,mut start: isize,count: isize,replace_with: Vec<#ty>)-> #name {
      abs_index!(start;this.len());
      let range=start as _..saturation_cast(count-1);
    
      match this.len() {
        0=> as_ptr!(this.drain(range).collect()),
        _=> as_ptr!(this.splice(range,replace_with).collect())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[macros::method]
    pub unsafe fn vec_splice_vec(this: &mut Vec<#ty>,mut start: isize,count: isize,replace_with: *mut Vec<#ty>)-> #name {
      let replace_with=replace_with.as_mut().unwrap_throw().clone();
      abs_index!(start;this.len());
      let range=start as _..saturation_cast(count-1);
    
      match this.len() {
        0=> as_ptr!(this.drain(range).collect()),
        _=> as_ptr!(this.splice(range,replace_with).collect())
      }
    }

    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_split_off(this: &mut Vec<#ty>,mut at: isize)-> #name {
      abs_index!(at;this.len());
    
      match constraints!(at => this.len()) {
        true=> as_ptr!(this.split_off(at as _)),
        _=> throw!(index_out_of_bounds)
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_shrink_to(this: &mut Vec<#ty>,min_capacity: isize) {
      this.shrink_to(min_capacity.unsigned_abs())
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_shrink_to_fit(this: &mut Vec<#ty>) {
      this.shrink_to_fit()
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_sort_by(this: &mut Vec<#ty>,f: Function) {
      this.sort_by(|a,b| ordering!(
        call!{ f(&JsValue::from(*a),&JsValue::from(*b)) }
        .unchecked_into_f64()
      ))
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_sort_unstable_by(this: &mut Vec<#ty>,f: Function) {
      this.sort_unstable_by(|a,b| ordering!(
        call! { f(&JsValue::from(*a),&JsValue::from(*b)) }
        .unchecked_into_f64()
      ))
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_split(this: &mut Vec<#ty>,f: Function)-> Slice {
      chunks_to_slice! {
        this.split_mut(|element| call! { f(&JsValue::from(*element)) }.is_truthy())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_split_at(this: &mut Vec<#ty>,mut mid: isize)-> Vec<Slice> {
      abs_index!(mid;this.len());
      let (split0,split1)=this.split_at_mut(mid as _);
      
      vec![split0.into(),split1.into()]
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_splitn(this: &mut Vec<#ty>,n: isize,f: Function)-> Slice {
      chunks_to_slice! {
        this.splitn_mut(n.unsigned_abs(),|element| call! { f(&JsValue::from(*element)) }.is_truthy())
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_swap(this: &mut Vec<#ty>,a: isize,b: isize) {
      let len=this.len();
    
      match constraints!(a => len) || constraints!(b => len) {
        true=> this.swap(saturation_cast(a),saturation_cast(b)),
        _=> throw!(capacity_overflow)
      }
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_swap_remove(this: &mut Vec<#ty>,index: isize)-> Option<#ty> {
      match constraints!(index => this.len()) {
        true=> Some(this.swap_remove(index as _)),
        _=> None
      }
    }
    
    // SAFETY: This function is only used inside the `Vec` class and not exposed to the user.
    #[macros::mangle_name(#ty)]
    #[method]
    pub unsafe fn vec_swap_with_slice(this: &mut Vec<#ty>,ptr: *mut #ty,len: usize) {
      this.swap_with_slice(std::slice::from_raw_parts_mut(ptr,len));
    }
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_truncate(this: &mut Vec<#ty>,len: isize) {
      this.truncate(len.unsigned_abs())
    }
    
    // W
    
    #[macros::mangle_name(#ty)]
    #[method]
    pub fn vec_windows(this: &mut Vec<#ty>,size: isize)-> Slice {
      chunks_to_slice! {
        this.windows(size.unsigned_abs())
      }
    }
    
    
    #[macros::mangle_name(#ty)]
    #[wasm_bindgen::prelude::wasm_bindgen]
    pub unsafe fn drop_vec(ptr: #name) {
      drop(Box::from_raw(ptr))
    }

  }.into()
}



