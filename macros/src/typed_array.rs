
use proc_macro2::Span;
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
  let name=syn::parse::<Ident>(args.pat.into_token_stream().into()).unwrap();
  let type_name=Ident::new(&args.ty.into_token_stream().to_string(),Span::call_site());


  quote::quote! {
    type #name=u8;

    #[macros::mangle_name(#type_name)]
    #[wasm_bindgen]
    pub fn vec_xd() {

    }

  }.into()
}



