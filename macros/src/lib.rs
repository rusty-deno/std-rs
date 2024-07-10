
mod method;
mod typed_array;

use proc_macro::TokenStream;


#[proc_macro_attribute]
pub fn method(attr: TokenStream,item: TokenStream)-> TokenStream {
  method::method_impl(attr,item)
}


#[proc_macro]
pub fn typed_array(item: TokenStream)-> TokenStream {
  typed_array::typed_array_impl(item)
}

