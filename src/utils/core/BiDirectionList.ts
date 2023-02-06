export class BiDirectionListNode<T> {
	next: BiDirectionListNode<T> | null = null;
	prev: BiDirectionListNode<T> | null = null;

	constructor(public value: T) {}
}

type TBiDirectionListMapCallback<T, S> = (
	value: T,
	index: number,
	node: BiDirectionListNode<T>
) => S;

function findHead<T>(node: BiDirectionListNode<T>) {
	let head = node;
	while (!!head.prev) {
		head = head.prev;
	}
	return head;
}

function findTail<T>(node: BiDirectionListNode<T>) {
	let tail = node;
	while (!!tail.next) {
		tail = tail.next;
	}
	return tail;
}

export class BiDirectionList<T> {
	static createNode<T>(value: T): BiDirectionListNode<T> {
		return new BiDirectionListNode<T>(value);
	}

	head: BiDirectionListNode<T> | null = null;
	tail: BiDirectionListNode<T> | null = null;

	private constructorCopyList(list: BiDirectionList<T>) {
		this.head = list.head;
		this.tail = list.tail;
	}

	constructor(param?: BiDirectionList<T>) {
		if (param === undefined) {
			return this;
		} else {
			this.constructorCopyList(param);
		}
	}

	push(node: BiDirectionListNode<T>) {
		if (this.isEmpty()) {
			this.head = findHead(node);
			this.tail = findTail(node);
			return;
		}

		this.tail!.next = node;
		node.prev = this.tail;

		let next = node;
		while (!!next.next) {
			next = next.next;
		}
		this.tail = next;
	}

	unshift(node: BiDirectionListNode<T>) {
		if (this.isEmpty()) {
			this.head = findHead(node);
			this.tail = findTail(node);
			return;
		}

		this.head!.prev = node;
		node.next = this.head;

		let prev = node;
		while (!!prev.prev) {
			prev = prev.prev;
		}
		this.head = prev;
	}

	isEmpty() {
		return !this.head;
	}

	map<S>(cb: TBiDirectionListMapCallback<T, S>) {
		const results = [] as S[];
		let node = this.head;
		let index = 0;
		while (!!node) {
			const result = cb(node.value, index++, node);
			results.push(result);
			node = node.next;
		}
		return results;
	}
}
