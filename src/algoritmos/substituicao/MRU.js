import { Fila } from '../../estruturas/Fila'

class MemMRU {

    constructor() {
        this.indiceAtual = 0;
        this.referencias = new Fila();
        this.memoria = Array(50).fill(null);
    }

    proximoIndice() { 
        
    }

    alocaPaginas(atual, processo, qtdPaginas, memVirtual) {
        let ini = (processo.id-1)*qtdPaginas;
        
        for (let j=ini; j<ini+qtdPaginas; j++) {
            let ok = true;
            let ind = this.indiceAtual;

            if (memVirtual[j] != null) continue;

            if (this.memoria[ind] != null) {
                let ant = ind;
                let indProcesso = Math.floor(this.memoria[ind]/qtdPaginas)+1;
                while ((atual != null && indProcesso == atual.id) || indProcesso == processo.id) {
                    this.proximoIndice();
                    ind = this.indiceAtual;
                    if (ind == ant) {
                        ok = false;
                        break;
                    }
                    indProcesso = Math.floor(this.memoria[ind]/qtdPaginas)+1;
                }
                if (!ok) break;
                memVirtual[ this.memoria[ind] ] = null;
            } 

            this.memoria[ind] = j;
            memVirtual[j] = ind;

            this.proximoIndice();
            
        }

    }
}

export { MemMRU }