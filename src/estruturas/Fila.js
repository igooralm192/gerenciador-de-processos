class Fila {
    constructor() {
        this.fila = [];
    }

    push(item) {
        this.fila.push(item);
    }

    pop() {
        if (this.fila.length != 0) this.fila.shift();
    }

    remove(i) {
        let item = this.fila[i];
        this.fila.splice(i, 1);
        return item;
    }

    topo() {
        if (this.fila.length == 0) return null;
        return this.fila[0];
    }

    vazio() {
        return this.fila.length == 0;
    }

    esvaziar() {
        while (!this.vazio()) this.pop();
    }

    length(){
        return this.fila.length;
    }
}

export { Fila }