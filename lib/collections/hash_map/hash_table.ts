import { Clone,Option } from '../../../mod.ts';
import { Entry } from './mod.ts';
import { HashSet, Vec } from '../mod.ts';
import { HashMap } from './hash_map.ts';
import { IteratorTrait } from "../mod.ts";
import { PartailEq } from '../../cmp/eq.ts';
import { $eq } from "../../cmp/macros.ts";

export type HasherFn<K>=(obj: K)=> number;

type Equivalent<K,V>=HashMap<K,V>|HashTable<K,V>|Map<K,V>;

/**
 * A HashTable that implementes constant time look-ups.
 * 
 * It must be used with a custom hash function..
 * 
 * Where the keys are limited and known at compile-time..
 * 
 * It's desined to be used only in special cases, for example `Keyword Recognization`.
 * 
 * * **NOTE**: The {@linkcode hasher} function mustn't return the same hash for two different keys.
 * 
 * ### Example
 * * Suppose the keys are Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday.
 * * Then the hash-function may be second char of the string & length of the string
 * ```ts
 * const hash = (key: string)=> key.charCodeAt(1) & key.length;
 * const table = new HashTable(hash, ["Sunday", 0], ["Monday", 1], ["Tuesday", 2], ["Wednesday", 3], ["Thursday", 4], ["Friday", 5], ["Saturday", 6]);
 * 
 * $assertEq(table.get("Monday"), Some(1));
 * ```
 */
export class HashTable<K,V> extends IteratorTrait<Entry<K,V>> implements Clone,PartailEq<Equivalent<K,V>> {
  private table=new Vec<Entry<K,V>>();
  #size=0;


  constructor(
    /** The hasher function used to hash {@linkcode K}. */
    public readonly hasher: HasherFn<K>,
    ...entries: Entry<K,V>[]
  ) {
    super();
    this.#size=entries.length;
    for(const [key,value] of entries) {
      const hash=this.hasher(key);
      if(this.table.nth(hash).value!=null) this.#size--;

      this.table[hash]=[key,value];
    }
  }

  /**
   * Constructs a HashMap from an iterable.
   * # Example
   * ```ts
   * const arr=new Vec(["xd",69],["69",0]);
   * const table=new HashTable(hashFn,arr);
   * ```
   */
  public static fromIter<K,V>(hasher: HasherFn<K>,iter: Iterable<Entry<K,V>>): HashTable<K,V> {
    const map=new HashTable<K,V>(hasher);
    for(const entry of iter) map.set(...entry);
    return map;
  }
  /**
   * Constructs a HashTable from an Record.
   * # Example
   * ```ts
   * const table=new HashTable(hashFn,{
   *    xd: 69
   * });
   */
  public static formRecord<K extends string|number|symbol,V>(hasher: HasherFn<K>,record: Record<K,V>): HashTable<K,V> {
    const map=new HashTable<K,V>(hasher);
    for(const key in record) map.set(key,record[key]);
    return map;
  }

  public eq(rhs: Equivalent<K,V>): boolean {
    if(this.#size!==(rhs instanceof Map?rhs.size:rhs.length)) return false;
    if(this===rhs || rhs instanceof HashTable && this.table===rhs.table) //(this.table===rhs.table || rhs.table.length==this.table.length))
      return true;

    for(const [key,val] of rhs) {
      if(!$eq(this.table.at(this.hasher(key))?.[1], val)) return false;
    }

    return true;
  }

  public clone(): HashTable<K,V> {
    return HashTable.fromIter(this.hasher,this.entries());
  }
  
  /**
   * Constructs a HashMap from the current table and returns it.
   */
  public hashMap(): HashMap<K,V> {
    return HashMap.fromIter(this.entries());
  }

  *[Symbol.iterator](): Iterator<Entry<K,V>> {
    yield* this.table;
  }

  /** Capacity of the table. */
  public get capacity(): number {
    return this.table.length;
  }

  /**
   * Returns the number of elements in the map.
   * 
   * ### Examples
  ```ts
  import { HashMap } from "std/collections";

  const a = new HashTable();
  
  $assertEq(a.length, 0);
  a.insert(1, "a");
  $assertEq(a.length, 1);
   */
  public get length() {
    return this.#size;
  }
  
  /**
   * * Inserts a key-value pair into the table.
   * * If the table did not have this key present, [None] is returned.
   * * If the table did have this key present, the value is updated, and the old value is returned.
   * # Example
   * ```ts
   * const table=new HashTable<number,string>(hashFn);
   * $assertEq(table.set(69,"xd"),Option.None);
   * ```
   */
  public set(key: K,value: V): Option<Entry<K,V>> {
    const index=this.hasher(key),entry=this.table.nth(index);
    this.table[index]=[key,value];
    ++this.#size;
    return entry;
  }

  /**
   * Returns the value corresponding to the key.
   * # Example
   * ```ts
   * const table=new HashTable<number,string>(hashFn);
   * table.set(69,"xd");
   * $assertEq(table.get(69),Some("xd"));
   * ```
   */
  public get(key: K): Option<V> {
    return new Option(this.table.at(this.hasher(key))?.[1]);
  }

  /**
   * Returns true if the table contains a value for the specified key else false.
   * # Example
   * ```ts
   * const table=new HashTable<number,string>(hashFn);
   * table.set(69,"xd");
   * $assert(table.has(69));
   * ```
   */
  public has(key: K): boolean {
    return this.table.at(this.hasher(key))!==undefined;
  }
  
  /**
   * Clears the map, removing all key-value pairs. Keeps the allocated memory for reuse.
   * 
   * ### Example
   * ```ts
   * const table=new HashTable<number,string>(hashFn);
   * table.set(69,"xd");
   * table.empty();
   * $assertEq(table.size,0);
   * ```
   */
  public empty() {
    for(let i=0;i<this.table.length;i++) delete this.table[i];
    this.#size=0;
  }
  
  /**
   * Returns whether the table is empty
   * # Example
   * ```ts
   * const table=new HashTable<number,string>(hashFn);
   * $assert(table.isEmpty());
   * ```
   */
  public isEmpty(): boolean {
    return !this.#size;
  }
  
  /**
   * Removes a key from the table, returning the value at the key if the key was previously in the table.
   * # Example
   * ```ts
   * const table=new HashTable<number,string>(hashFn);
   * table.set(69,"xd");
   * $assertEq(table.remove(69),Some("xd"));
   * ```
   */
  public remove(key: K): Option<V> {
    const index=this.hasher(key),entry=new Option(this.table.nth(index).value?.[1]);
    delete this.table[index];
    --this.#size;
    return entry;
  }
  
  public get [Symbol.toStringTag](): string {
    if(this.isEmpty()) return "{}";
    let str="{\n\t";
    for(const [key,value] of this) str+=`${key} => ${value}\n`;
    return str+"\n}";
  }
  
  /**
   * Returns the string representation of the current table.
   * # Example
   * ```ts
   * const table=new HashTable<number,string>(hashFn);
   * table.set(69,"xd");
   * $assertEq(table.toString,`{
   *    69: xd
   * }`);
   * ```
   */
  public toString(): string {
    return this[Symbol.toStringTag];
  }

  /**
   * Returns a set of the keys present in the current table.
   * # Example
   * ```ts
   * const table=new HashTable<number,string>(hashFn,["xd",69],["xd1",0]);
   * $assertEq(table.keySet(),new HashSet("xd","xd1"));
   * ```
   */
  public keySet(): HashSet<K> {
    return HashSet.fromIter(this.keys());
  }

  /**
   * Returns a set of the keys present in the current table.
   * # Example
   * ```ts
   * const table=new HashTable<number,string>(hashFn,["xd",69],["xd1",0]);
   * $assertEq(table.keys(),$vec("xd","xd1"));
   * ```
   */
  public keys(): Vec<K> {
    return this.table.map(([key,_])=> key);
  }

  /**
   * Returns a set of the keys present in the current table.
   * # Example
   * ```ts
   * const table=new HashTable<number,string>(hashFn,["xd",69],["xd1",0]);
   * $assertEq(table.entrySet(),new HashSet(["xd",69],["xd1",0]));
   * ```
   */
  public entrySet(): HashSet<Entry<K,V>> {
    return new HashSet(...this);
  }

  /**
   * Returns a set of the keys present in the current table.
   * # Example
   * ```ts
   * const table=new HashTable<number,string>(hashFn,["xd",69],["xd1",0]);
   * $assertEq(table.entries(),$vec(["xd",69],["xd1",0]));
   * ```
   */
  public entries(): Vec<Entry<K,V>> {
    return new Vec(...this);
  }

  /**
   * Returns a set of the keys present in the current table.
   * # Example
   * ```ts
   * const table=new HashTable<number,string>(hashFn,["xd",69],["xd1",69]);
   * $assertEq(table.valueSet(),new HashSet(69));
   * ```
   */
  public valueSet(): HashSet<V> {
    return HashSet.fromIter(this.values());
  }
  
  /**
   * Returns a set of the keys present in the current table.
   * # Example
   * ```ts
   * const table=new HashTable<number,string>(hashFn,["xd",69],["xd1",0]);
   * $assertEq(table.values(),$vec(69,0));
   * ```
   */
  public values(): Vec<V> {
    return this.table.map(([_,value])=> value);
  }
}

