export type LinkedListNode<T> = {
	value: T;
	next: LinkedListNode<T> | null;
};

type TLinkedListMapCallback<T, S> = (item: T, index: number) => S;

export class LinkedList<T> {
	static createNode<T>(value: T): LinkedListNode<T> {
		return {
			value,
			next: null,
		};
	}

	private headNode: LinkedListNode<T> | null;

	constructor(head?: LinkedListNode<T> | null) {
		this.headNode = !head ? null : head;
	}

	add(node: LinkedListNode<T>) {
		if (this.isEmpty()) return (this.headNode = node);

		let next = this.headNode!;
		while (!!next.next) {
			next = next.next;
		}
		next.next = node;
	}

	isEmpty() {
		return !this.headNode;
	}

	map<S>(cb: TLinkedListMapCallback<T, S>) {
		const results = [] as S[];
		let node = this.head;
		let index = 0;
		while (!!node) {
			const result = cb(node.value, index++);
			results.push(result);
			node = node.next;
		}
		return results;
	}

	get head() {
		return this.headNode;
	}
}
