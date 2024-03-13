import { PathBuf } from '../path.ts';
import { createDirSync,createDir } from './mod.ts';


export class DirBuilder {
  public static create(path: PathBuf,options: Deno.MkdirOptions) {
    return createDir(path,options);
  }

  public static createSync(path: PathBuf,options: Deno.MkdirOptions) {
    return createDirSync(path,options);
  }
}



