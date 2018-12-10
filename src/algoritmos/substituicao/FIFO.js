class MemFIFO {

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
        
    }

    alocaPaginas(atual, processo, qtdPaginas, memVirtual) {
        let ini = (processo.id-1)*qtdPaginas;

        for (let j=ini; j<ini+qtdPaginas; j++) {
            let ind = this.indiceAtual;

            if (memVirtual[j] != null) continue;

            if (this.memoria[ind] != null) {
                let i = 0;
                
                while (
                    i<this.referencias.length && 
                    ((atual != null && this.referencias[i].id == atual.id && atual.estado != "Sobrecarga") || 
                    this.referencias[i].id == processo.id)) i++;

                if (i == this.referencias.length) {
                    break;
                }
                
                let menorRef = this.referencias[i];
                this.referencias.splice(i, 1);
                
                memVirtual[menorRef.pagina] = null;
                this.memoria[menorRef.referencia] = j;
                memVirtual[j] = menorRef.referencia;
                this.referencias.push({id: processo.id, pagina: j, referencia: menorRef.referencia});
                this.ultimasModificacoes.push(menorRef.referencia);

            } else {
                this.memoria[ind] = j;
                memVirtual[j] = ind;
                this.referencias.push({id: processo.id, pagina: j, referencia: ind});
                this.ultimasModificacoes.push(ind)

                this.proximoIndice();
            }
        }


        console.log('referencias',this.referencias)
    }
}

export { MemFIFO }