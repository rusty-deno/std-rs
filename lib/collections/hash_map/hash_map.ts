import { Entry } from './mod.ts';
import { Clone } from '../../clone.ts';
import { Option } from '../../../mod.ts';
import { Vec } from '../vec/mod.ts';
import { $eq } from "../../cmp/macros/mod.ts";
import { IntoIterator } from "../../iter/iter.ts";
import { PartailEq } from '../../cmp/eq.ts';
import { HashTable } from './hash_table.ts';
import { HashSet } from '../hash_set/hash_set.ts';
import { $todo } from "../../declarative-macros/panics.ts";

type Equivalent<K,V>=HashMap<K,V>|Map<K,V>|HashTable<K,V>;


/**
 * An improved version of native {@linkcode Map} with extra type safety
 * 
 * # Example
 * ```ts
 * const map=new HashMap([69,"xd"]);
 * $assertEq(map.get(69),Some("xd"));
 * ```
 */
export class HashMap<K,V> extends IntoIterator<Entry<K,V>> implements Clone,PartailEq<Equivalent<K,V>> {
  #inner: Map<K,V>;

  constructor(...entries: Entry<K,V>[]) {
    super();
    this.#inner=new Map(entries);
  }

  /**
   * Constructs a HashMap from an iterable.
   * # Example
   * ```ts
   * const iter=new Vec(["xd",69],["69",0]);
   * const map=HashMap.fromIter(iter);
   * ```
   */
  public static fromIter<K,V>(iter: Iterable<Entry<K,V>>): HashMap<K,V> {
    if(iter instanceof HashTable) return iter.hashMap();

    const map=new HashMap<K,V>();
    map.#inner=iter instanceof Map?iter:new Map(iter);

    return map;
  }

  /**
   * Constructs a HashMap from an Record.
   * # Example
   * ```ts
   * const map=HashMap.fromRecord({
   *    xd: 69,
   *    xD: 69
   * });
   * ```
   */
  // deno-lint-ignore no-explicit-any
  public static formRecord<K extends keyof any,V>(record: Record<K,V>): HashMap<K,V> {
    const map=new HashMap<K,V>();
    for(const key in record) map.set(key,record[key]);
    return map;
  }


  public eq(rhs: Equivalent<K, V>): boolean {
    return rhs instanceof HashMap?
      this === rhs || this.#inner===rhs.#inner || $eq(this.#inner,rhs.#inner)
    : rhs instanceof Map?
      this.#inner===rhs || $eq(this.#inner,rhs)
    : rhs.eq(this);
  }

  *[Symbol.iterator](): Iterator<Entry<K,V>> {
    yield* this.#inner;
  }

  /**
   * Returns the number of elements in the map.
   * 
   * ### Examples
  ```ts
  import { HashMap } from "std/collections";
import { HashTable } from './hash_table';

  const a = new HashMap();
  
  $assertEq(a.length, 0);
  a.insert(1, "a");
  $assertEq(a.length, 1);
   */
  public get length(): number {
    return this.#inner.size;
  }

  /**
   * Returns the value corresponding to the key.
   * # Example
   * ```ts
   * const map=new HashMap<number,string>();
   * map.set(69,"xd");
   * $assertEq(map.get(69),Some("xd"));
   * ```
   */
  public get(key: K): Option<V> {
    return new Option(this.#inner.get(key));
  }
  
  /**
   * Inserts a key-value pair into the map.
   * 
   * If the map did not have this key present, `None` is returned.
   * 
   * If the map did have this key present, the value is updated, and the old value is returned.
   * # Example
   * ```ts
   * const map=new HashMap<number,string>();
   * $assertEq(map.set(69,"xd"),Option.None);
   * ```
   */
  public set(key: K,value: V): Option<V> {
    const prev=this.get(key);
    this.#inner.set(key,value);

    return prev;
  }

  /**
   * Returns true if the map contains a value for the specified key else false.
   * # Example
   * ```ts
   * const map=new HashMap<number,string>();
   * map.set(69,"xd");
   * 
   * $assert(map.contains(69));
   * ```
   */
  public contains(key: K): boolean {
    return this.#inner.has(key);
  }

  /**
   * Removes a key from the map, returning the value at the key if the key was previously in the map.
   * # Example
   * ```ts
   * const map=new HashMap<number,string>();
   * map.set(69,"xd");
   * $assertEq(map.remove(69),Some("xd"));
   * ```
   */
  public remove(key: K): boolean {
    return this.#inner.delete(key);
  }

  /**
   * Clears the map, removing all key-value pairs. Keeps the allocated memory for reuse.
   * 
   * # Example
   * ```ts
   * const map=new HashMap<number,string>();
   * map.set(69,"xd");
   * map.clear();
   * $assertEq(map.size,0);
   * ```
   */
  public clear() {
    this.#inner.clear();
  }

  /**
   * Returns whether the map is empty
   * # Example
   * ```ts
   * const map=new HashMap<number,string>();
   * $assert(map.isEmpty());
   * ```
   */
  public isEmpty(): boolean {
    return !this.#inner.size;
  }

  /**
   * Returns the string representation of the current map.
   * # Example
   * ```ts
   * const map=new HashMap<number,string>();
   * map.set(69,"xd");
   * $assertEq(map.toString,`{
   *    69: xd
   * }`);
   * ```
   */
  public toString(): string {
    if(this.isEmpty()) return "{}";

    let str="{\n\t";
    for(const [key,value] of this) str+=`${key} => ${value}\n`;
    
    return str+"\n}";
  }

  public get [Symbol.toStringTag](): string {
    return this.toString();
  }

  /**
   * Returns a set of the keys present in the current map.
   * # Example
   * ```ts
   * const map=new HashMap<number,string>(["xd",69],["xd1",0]);
   * $assertEq(map.keySet(),new HashSet("xd","xd1"));
   * ```
   */
  public keySet(): HashSet<K> {
    return HashSet.fromIter(this.#inner.keys());
  }

  /**
   * Returns a set of the keys present in the current map.
   * # Example
   * ```ts
   * const map=new HashMap<number,string>(["xd",69],["xd1",0]);
   * $assertEq(map.keys(),$vec("xd","xd1"));
   * ```
   */
  public keys(): Vec<K> {
    return Vec.from(this.#inner.keys());
  }

  /**
   * Returns a set of the keys present in the current map.
   * # Example
   * ```ts
   * const map=new HashMap<number,string>(["xd",69],["xd1",0]);
   * $assertEq(map.entrySet(),new HashSet(["xd",69],["xd1",0]));
   * ```
   */
  public entrySet(): HashSet<Entry<K,V>> {
    return HashSet.fromIter(this.#inner.entries());
  }

  /**
   * Returns a set of the keys present in the current map.
   * # Example
   * ```ts
   * const map=new HashMap<number,string>(["xd",69],["xd1",0]);
   * $assertEq map.entries(),$vec(["xd",69],["xd1",0]));
   * ```
   */
  public entries(): Vec<Entry<K,V>> {
    return new Vec(...this.#inner);
  }

  /**
   * Returns a set of the keys present in the current map.
   * # Example
   * ```ts
   * const map=new HashMap<number,string>(["xd",69],["xd1",69]);
   * $assertEq(map.valueSet(),new HashSet(69));
   * ```
   */
  public valueSet(): HashSet<V> {
    return HashSet.fromIter(this.#inner.values());
  }

  /**
   * Returns a set of the keys present in the current map.
   * # Example
   * ```ts
   * const map=new HashMap<number,string>(hashFn,["xd",69],["xd1",0]);
   * $assertEq(map.values(),$vec(69,0));
   * ```
   */
  public values(): Vec<V> {
    return Vec.from(this.#inner.values());
  }

  public iter() {
    return $todo();
  }
  
  public clone(): HashMap<K,V> {
    return HashMap.fromIter(this.#inner);
  }
}


