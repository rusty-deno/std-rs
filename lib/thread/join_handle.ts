import * as lib from "../../bindings/std_rs.js";
import { $unimplemented } from "../declarative-macros/mod.ts";
import { Option,result } from '../error/mod.ts';
import { Drop } from '../drop.ts';



// TODO: seal the class
export class JoinHandle<T> extends Drop {
  protected constructor(private ___ptr: number,private ___return: Option<T>) {
    super();
  }

  protected drop(): void {
    lib.drop_join_handle(this.___ptr);
  }

  public isFinished() {
    return lib.is_finished(this.___ptr);
  }

  public thread() {
    return $unimplemented();
  }

  public join() {
    return result.$resultSync(()=> {
      lib.join(this.___ptr);
      return this.___return.value as T;
    });
  }
}







