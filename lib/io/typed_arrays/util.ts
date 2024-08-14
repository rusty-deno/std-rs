
export function isNum(p: PropertyKey): p is number {
  return typeof p==="string" && Number(p)==p as unknown;
}

