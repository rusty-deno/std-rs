
mod method;
mod typed_array;

use proc_macro2::Span;
use proc_macro::TokenStream;

use syn::{
  FnArg,
  Ident,
  Token,
  parse_macro_input,
  punctuated::Punctuated
};



#[proc_macro_attribute]
pub fn method(attr: TokenStream,item: TokenStream)-> TokenStream {
  method::method_impl(attr,item)
}


#[proc_macro]
pub fn typed_array(item: TokenStream)-> TokenStream {
  parse_macro_input!(item with Punctuated::<FnArg,Token![,]>::parse_terminated)
  .into_iter()
  .map(|arg| typed_array::typed_array_impl(arg))
  .collect::<TokenStream>()
}

#[proc_macro_attribute]
pub fn mangle_name(attr: TokenStream,item: TokenStream)-> TokenStream {
  let mut function=syn::parse::<syn::ItemFn>(item).expect("This macro is only meant for functions");

  function.sig.ident=Ident::new(
    &format!("{}_{}",attr.to_string().trim(),function.sig.ident.to_string().trim()),
    Span::call_site()
  );

  quote::quote! {
    #function
  }.into()
}

