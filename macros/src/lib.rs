
mod method;
mod typed_array;

use syn::Ident;
use proc_macro2::Span;
use proc_macro::TokenStream;



#[proc_macro_attribute]
pub fn method(attr: TokenStream,item: TokenStream)-> TokenStream {
  method::method_impl(attr,item)
}


#[proc_macro]
pub fn typed_array(item: TokenStream)-> TokenStream {
  typed_array::typed_array_impl(item)
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

