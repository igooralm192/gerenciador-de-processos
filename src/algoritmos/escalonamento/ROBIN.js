import { Fila } from '../../estruturas/Fila';

class ROBIN {
    constructor(processos, dados) {
        this.processos = processos;
        this.sobrecarga = dados.sobrecarga;
        this.quantum = dados.quantum;
        this.qtdPaginas = dados.qtdPaginas;
        this.tempoDisco = dados.tempoDisco;
        this.filaProntos = new Fila();
        /*this.filaProntos = new PriorityQueue({
            comparator: (a, b) => {
                if (a.tempoChegada == b.tempoChegada) return a.id - b.id;
                return a.tempoChegada - b.tempoChegada;
            }
        });*/
        this.filaDisco = new Fila();
    }

    proximoEstado(tempo, processoAtual, memVirtual, memReal) {
        let estados = [];
        
        for (const i in this.processos) {
            if (this.processos[i].tempoChegada == tempo) {

                this.processos[i].estado = "Espera - FP";
                this.processos[i].tempoDecorrido = 1;

                this.filaProntos.push(this.processos[i]);
            }
        }

        if (processoAtual != null) {
            if (processoAtual.estado == "Execução") {
                if ((processoAtual.tempoDecorrido == this.quantum) && (processoAtual.tempoExecucaoAux > 0)) {
                    processoAtual.estado = "Sobrecarga";
                    processoAtual.tempoDecorrido = 1;

                } else if ((processoAtual.tempoDecorrido < this.quantum) && (processoAtual.tempoExecucaoAux > 0)) {
                    processoAtual.tempoDecorrido++;
                    processoAtual.tempoExecucaoAux--;
                }else if (processoAtual.tempoExecucaoAux == 0){
                    processoAtual.estado = "Acabou"
                    processoAtual = null;
                }
            } else if(processoAtual.estado == "Sobrecarga"){
                if(processoAtual.tempoDecorrido == this.sobrecarga){
                    processoAtual.estado = "Espera - FP";
                    processoAtual.tempoDecorrido = 1;
                    this.filaProntos.push(processoAtual);
                    processoAtual = null;
                }else processoAtual.tempoDecorrido++;
            }
        }

        if (!this.filaDisco.vazio()) {
            let topo = this.filaDisco.topo();

            if (topo.tempoDecorrido == this.tempoDisco) {
                this.filaDisco.pop();

                memReal.alocaPaginas(processoAtual, topo, this.qtdPaginas, memVirtual);

                topo.estado = "Espera - FP";
                topo.tempoDecorrido = 1;
                this.filaProntos.push(topo);

                if (!this.filaDisco.vazio()) {
                    let topo = this.filaDisco.topo();

                    topo.estado = "Disco";
                    topo.tempoDecorrido = 1;
                }
            } else topo.tempoDecorrido++;
        }

        while (processoAtual == null && this.filaProntos.fila.length != 0) {
            const topo = this.filaProntos.topo(); 
            this.filaProntos.pop();

            if (!topo.verificaPaginas(memVirtual, this.qtdPaginas)) {
                if (this.tempoDisco == 0) {
                    memReal.alocaPaginas(processoAtual, topo, this.qtdPaginas, memVirtual);

                    topo.estado = "Espera - FP";
                    topo.tempoDecorrido = 1;
                    this.filaProntos.push(topo);

                } else {
                    topo.tempoDecorrido = 1;
                    if (this.filaDisco.vazio()) {
                        topo.estado = "Disco";
                        this.filaDisco.push(topo);
                    } else {
                        topo.estado = "Espera - D";
                        this.filaDisco.push(topo);
                    }
                }
            } else {
                topo.estado = "Execução"
                if (topo.tempoExecucaoAux == 0) {
                    topo.estado = "Acabou";
                    processoAtual = null;
                } else {
                    topo.tempoDecorrido = 1;
                    topo.tempoExecucaoAux--;
                    processoAtual = topo;
                    break;
                }
                
            }
            
        }
        
        for (const i in this.processos) {
            estados.push( this.processos[i].estado )
        }

        return [estados, processoAtual, this.filaProntos, this.filaDisco]
    }

    limpar() {
        this.filaProntos.esvaziar();
        this.filaDisco.esvaziar();
    }
}


export { ROBIN }