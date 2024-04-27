import { Entry,HashMap } from "../hash_map/mod.ts";
import { HashTable } from '../hash_map/hash_table.ts';

type MapLike<K,V>=Iterable<Entry<K,V>>;
type Equivalent<K,V>=K extends PropertyKey?Record<K,V>|MapLike<K,V>:MapLike<K,V>;

/**
 * Constructs a {@linkcode HashMap} from any type of supported object.
 * 
 * # Example
 * ```ts
 * const map=$map({
 *    xd: 69,
 *    xD: 69
 * });
 * const map1=$map([
 *    ["xd",69],
 *    ["xD",69]
 * ]);
 * 
 * $assertEq(map,map1);
 * ```
 */
export function $map<K,V>(map: Equivalent<K,V>): HashMap<K,V> {
  return map instanceof HashMap?
    map
  : map instanceof HashTable?
    map.hashMap()
  : typeof (map as Iterable<unknown>)[Symbol.iterator]==="function"?
    HashMap.fromIter(map as Iterable<Entry<K,V>>)
  :
    HashMap.formRecord(map as Record<PropertyKey, V>) as unknown as HashMap<K,V>;
}


