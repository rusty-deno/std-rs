import { Node } from "./mod.ts";
import { $eq } from "../../../cmp/mod.ts";
import { ArrayLite } from "../../../types.ts";
import { PartailEq } from '../../../cmp/eq.ts';
import { Option,None,Some } from "../../../error/mod.ts";
import { $todo } from "../../../declarative-macros/panics.ts";
import { IntoIterator, DoubleEndedIterator } from '../../../iter/mod.ts';

type Item<T>=T|PartailEq<T>;
type Equivalent<T>=ArrayLite<Item<T>>|LinkedList<Item<T>>;


export class LinkedList<T> extends IntoIterator<T> implements PartailEq<Equivalent<T>> {
  #size: number;
  #head: Option<Node<T>>=None();
  #tail=new WeakRef(this.#head);

  constructor(...nodes: T[]) {
    super();
    for(const node of nodes) this.#putBack(new Node(node,null));

    this.#size=nodes.length;
  }

  public static fromIter<T>(iter: Iterable<T>): LinkedList<T> {
    return new LinkedList(...iter);
  }

  public static fromIterRev<T>(iter: Iterable<T>): LinkedList<T> {
    const self=new LinkedList<T>();

    for(const element of iter) self.pushFront(element);

    return self;
  }
  
  *[Symbol.iterator](): Iterator<T> {
    for(let iter=this.#head.value;iter&&iter.next.value;iter=iter.next.value) yield iter.data;
  }

  #putBack(node: Node<T>) {
    node.prev=this.#tail;
    this.tail.value?this.tail.value.next.insert(node):this.tail.insert(node);
    this.#tail=new WeakRef(this.tail.value?.next.value?this.tail.value.next:this.tail);
  }
  
  public get [Symbol.toStringTag](): string {
    return [...this].join(" => ");
  }
  
  public toString(): string {
    return this[Symbol.toStringTag];
  }
  
  public get length(): number {
    return this.#size;
  }
  
  public get front(): Option<Node<T>> {
    return this.#head;
  }
  
  public get back(): Option<Node<T>> {
    return this.#tail.deref()!;
  }

  private set tail(node: Option<Node<T>>) {
    this.#tail.deref()!=node;
  }

  private get tail(): Option<Node<T>> {
    return this.#tail.deref()!;
  }
  
  public pushFront(data: T) {
    this.#head=Some(new Node(data,this.#head.value));
    this.#size++;
  }
  
  public pushBack(data: T) {
    this.#putBack(new Node(data,null));
    this.#size++;
  }
  
  public popBack(): Option<T> {
    const last=new Option(this.#tail.deref()?.value?.data);
    
    const tail=this.#tail.deref();
    switch(this.#head.value) {
      case null: return last;
      case tail?.value:
        tail?.empty();
      break;
      default:
        this.#tail=tail!.value!.prev;
        this.tail.value?.next.empty();
      break;
    }

    this.#size--;
    return last;
  }
  
  public popFront(): Option<T> {
    const entity=this.#head.value?.data;
        
    this.#head=new Option(this.#head.value?.next.value);
    if(entity) this.#size--;
    
    return new Option(entity);
  }

  public append(other: LinkedList<T>) {
    if(!other.#size) return;

    this.#putBack(other.#head.value!);
    this.#tail=other.#tail;
    this.#size+=other.#size;
  }
  
  public appendFront(other: LinkedList<T>) {
    this.#head.value && other.#putBack(this.#head.value);
    this.#head=other.#head;
    this.#size=other.#size;
  }

  public empty() {
    this.#head=None(null);
    this.#tail=new WeakRef(this.#head);
    this.#size=0;
  }
  
  public isEmpty() {
    return !this.#size;
  }

  public eq(rhs: Equivalent<T>): boolean {
    if(rhs.length!=this.#size) return false;

    for(const [lhsElement,rhsElement] of this.iter().zip(rhs)) {
      if($eq(lhsElement,rhsElement)) return false;
    }

    return true;
  }
  
  public iter(): DoubleEndedIterator<T> {
    return $todo();
  }
  
  public enumerate() {
    return this.iter().enumerate();
  }
  
  public rev() {
    return this.iter().rev();
  }

  public reverse() {
    this.#head=LinkedList.fromIterRev<T>(this).#head;
  }

  public at(index: number) {
    if(index<0) index+=this.#size;

    let i=0;
    for(const element of this) {
      if(i++==index) return new Option(element)
    };

    return None<T>();
  }
}









