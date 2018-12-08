import { Fila } from '../../estruturas/Fila'

class MemMRU {

    constructor() {
        this.indiceAtual = 0;
        this.referencias = [];
        this.memoria = Array(50).fill(null);
        this.ultimasModificacoes = [];
    }

    proximoIndice() { 
        this.indiceAtual++;
        if (this.indiceAtual == 50) this.indiceAtual = 0;
    }

    atualizaReferencia(processo) {
        let ref = null;

        for (let i in this.referencias) {
            if (this.referencias[i].id == processo.id) {
                ref = this.referencias[i];
                this.referencias.splice(i, 1);
                break;
            }
        }

        if (ref == null) {
            ref = {
                id: processo.id,
                paginas: []
            }
        }

        this.referencias.push(ref);
    }

    alocaPaginas(atual, processo, qtdPaginas, memVirtual) {
        let ini = (processo.id-1)*qtdPaginas;
        let paginas = [];

        for (let j=ini; j<ini+qtdPaginas; j++) {
            let ind = this.indiceAtual;

            if (memVirtual[j] != null) continue;

            if (this.memoria[ind] != null) {
                let i = 0;
                
                while ((atual != null && this.referencias[i].id == atual.id) || this.referencias[i].id == processo.id) i++;
                let menorRef = this.referencias[i];

                var pagina = menorRef.paginas.shift();
                
                memVirtual[pagina.id] = null;
                this.memoria[pagina.referencia] = j;
                memVirtual[j] = pagina.referencia;
                paginas.push({id: j, referencia: pagina.referencia});
                this.ultimasModificacoes.push(pagina.referencia)

                if (menorRef.paginas.length == 0) this.referencias.splice(i, 1);
                

            } else {
                this.memoria[ind] = j;
                memVirtual[j] = ind;
                paginas.push({id: j, referencia: ind});
                this.ultimasModificacoes.push(ind)

                this.proximoIndice();
            }
        }

        
        for (let i in this.referencias) {
            if (this.referencias[i].id == processo.id) {
                this.referencias[i].paginas = paginas.concat(this.referencias[i].paginas);
                break;
            }
        }

        console.log('referencias',this.referencias)
    }
}

export { MemMRU }