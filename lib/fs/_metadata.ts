import { Metadata } from "../../std/fs.ts";
import { Option } from "../error/mod.ts";


export function parseMetadata({
  atime,
  birthtime,
  blksize,
  blocks,
  dev,
  gid,
  ino,
  isBlockDevice,
  isCharDevice,
  isDirectory,
  isFifo,
  isFile,
  isSocket,
  isSymlink,
  mode,
  mtime,
  nlink,
  rdev,
  size,
  uid
}: Deno.FileInfo): Metadata {
  return {
    dev,
    size,
    isFile,
    isSymlink,
    isDirectory,
    permissions: new Option(mode),
    atime: new Option(atime),
    birthtime: new Option(birthtime),
    blksize: new Option(blksize),
    blocks: new Option(blocks),
    gid: new Option(gid),
    ino: new Option(ino),
    isBlockDevice: new Option(isBlockDevice),
    isCharDevice: new Option(isCharDevice),
    isFifo: new Option(isFifo),
    isSocket: new Option(isSocket),
    mtime: new Option(mtime),
    nlink: new Option(nlink),
    rdev: new Option(rdev),
    uid: new Option(uid)
  };
}


