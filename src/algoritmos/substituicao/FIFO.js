class MemFIFO {
    constructor() {
        this.indiceAtual = 0;
        this.memoria = Array(50).fill(null);
    }

    proximoIndice() { 
        this.indiceAtual++;
        if (this.indiceAtual == 50) this.indiceAtual = 0;
    }

    alocaPaginas(processo, qtdPaginas, memVirtual) {
        let ini = (processo.id-1)*qtdPaginas;
        
        for (let j=ini; j<ini+qtdPaginas; j++) {
            let ind = this.indiceAtual;

            if (this.memoria[ind] != null) memVirtual[ this.memoria[ind] ] = null;
            this.memoria[ind] = j;
            memVirtual[j] = ind;

            this.proximoIndice();
        }

    }
}

export { MemFIFO }