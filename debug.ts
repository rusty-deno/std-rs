import { PartailEq } from './lib/cmp/eq.ts';

class XD implements PartailEq<XD|number> {
  constructor(public xd: number) {}
  
  public eq(rhs: XD|number): boolean {
    return rhs instanceof XD?this.xd===rhs.xd:this.xd===rhs;
  }
}

class XDXD {
  constructor(public xd: number) {}
}

const xd=new XD(69);

console.log(xd.eq(new XDXD(69) as XD));

