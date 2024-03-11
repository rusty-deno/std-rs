
extern crate proc_macro;

use syn::*;
use token::Mut;
use quote::quote;
use proc_macro::TokenStream;
use proc_macro2::TokenStream as TokenStream2;


#[proc_macro_attribute]
pub fn method(_attr: TokenStream,item: TokenStream)-> TokenStream {
  let mut f=syn::parse::<ItemFn>(item).unwrap();

  let name=f.sig.ident;
  let vis=&f.vis;
  let asyncness=&f.sig.asyncness;
  let unsafety=&f.sig.unsafety;
  let return_type=f.sig.output;
  let stmts=f.block.stmts;

  let params=&mut f.sig.inputs;
  let this=params.first_mut().expect("This function doesn't have any `this` argument.");
  let (this_def,this_arg)=def_this(this);

  unsafe {
    std::ptr::replace(
      this as *mut _,
      syn::parse(this_arg.into())
      .unwrap()
    );
  };

  quote! {
    #[wasm_bindgen::prelude::wasm_bindgen]
    #vis #unsafety #asyncness fn #name(#params) #return_type {
      #this_def;
      #(#stmts)*
    }
  }.into()
}



fn def_this(arg: &mut FnArg)-> (TokenStream2,TokenStream2) {
  let pat_type=match arg {
    FnArg::Typed(pat_type)=> pat_type,
    _=> panic!("This macro cannot be used here.")
  };
  let (mutability,this_arg_ident)=match pat_type.pat.as_ref() {
    Pat::Ident(PatIdent { ident,mutability,.. })=> (mutness(mutability),ident),
    _=> unreachable!(),
  };



  match pat_type.ty.as_ref() {
    Type::Path(path)=> (
      quote! {
        let #pat_type=unsafe { *Box::from_raw(#this_arg_ident as *mut _) }
      },
      quote! {
        #this_arg_ident: *#mutability #path
      }
    ),
    Type::Reference(reference)=> {
      let mut_=&reference.mutability;
      let mutability=mutness(mut_);
      let lifetime=&reference.lifetime;
      let typ=&reference.elem;

      (
        quote! {
          let #pat_type=unsafe { &#lifetime #mut_ *(#this_arg_ident as *#mutability _) }
        },
        quote! {
          #this_arg_ident: *#mutability #typ
        }
      )
    },
    _=> panic!("This function doesn't have a `this` argument")
  }
}

fn mutness(mutablity: &Option<Mut>)-> TokenStream2 {
  match mutablity {
    Some(m)=> quote! { #m },
    None=> quote! { const }
  }
}


