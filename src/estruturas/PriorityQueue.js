import { Fila } from './Fila';

class PriorityQueue extends Fila {
    constructor(comparator) {
        super();
        this.comparator = comparator;
    }
    push(item) {
        super.push(item)
        this.fila.sort(this.comparator);
    }

    pop() {
        super.pop();
        this.fila.sort(this.comparator);
    }

    remove(i) {
        super.remove(i);
        this.fila.sort(this.comparator);
    }
}

export { PriorityQueue };