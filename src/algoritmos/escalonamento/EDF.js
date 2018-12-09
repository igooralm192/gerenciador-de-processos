import PriorityQueue from 'js-priority-queue'
import { Fila } from '../../estruturas/Fila';

class EDF {
    constructor(processos, dados) {
        this.processos = processos;
        this.sobrecarga = dados.sobrecarga;
        this.quantum = dados.quantum;
        this.qtdPaginas = dados.qtdPaginas;
        this.tempoDisco = dados.tempoDisco;
        this.filaProntos = new PriorityQueue({
            comparator: (a, b) => {
                if (a.deadlineAux == b.deadlineAux) {
                    if (a.tempoChegada == b.tempoChegada) return a.id - b.id;
                    return a.tempoChegada - b.tempoChegada
                }
                return a.deadlineAux - b.deadlineAux;
            }
        });
        this.filaDisco = new Fila();
    }

    proximoEstado(tempo, processoAtual, memVirtual, memReal) {
        let estados = [];
        
        for (const i in this.processos) {
            if (this.processos[i].tempoChegada == tempo) {

                this.processos[i].estado = "Espera - FP";
                this.processos[i].tempoDecorrido = 1;
                this.processos[i].deadlineAux = this.processos[i].deadline + this.processos[i].tempoChegada;
                this.filaProntos.queue(this.processos[i])
            }
        }

        if (!this.filaDisco.vazio()) {
            let topo = this.filaDisco.topo();

            if (topo.tempoDecorrido == this.tempoDisco) {
                this.filaDisco.pop();

                memReal.alocaPaginas(processoAtual, topo, this.qtdPaginas, memVirtual);

                topo.estado = "Espera - FP";
                topo.tempoDecorrido = 1;
                this.filaProntos.queue(topo);

                if (!this.filaDisco.vazio()) {
                    let topo = this.filaDisco.topo();

                    topo.estado = "Disco";
                    topo.tempoDecorrido = 1;
                }
            } else topo.tempoDecorrido++;
        }

        if (processoAtual != null) {
            if (processoAtual.estado == "Execução" || processoAtual.estado == "Deadline") {
                if ((processoAtual.tempoDecorrido == this.quantum) && (processoAtual.tempoExecucaoAux > 0)) {
                    processoAtual.estado = "Sobrecarga";
                    processoAtual.tempoDecorrido = 1;

                } else if ((processoAtual.tempoDecorrido < this.quantum) && (processoAtual.tempoExecucaoAux > 0)) {
                    processoAtual.tempoDecorrido++;
                    processoAtual.tempoExecucaoAux--;
                    if(processoAtual.deadlineAux < tempo){
                        processoAtual.estado = "Deadline";
                    }
                }else if (processoAtual.tempoExecucaoAux == 0){
                    processoAtual.estado = "Acabou"
                    processoAtual = null;
                }
            } else if(processoAtual.estado == "Sobrecarga"){
                if(processoAtual.tempoDecorrido == this.sobrecarga){
                    processoAtual.estado = "Espera - FP";
                    processoAtual.tempoDecorrido = 1;
                    this.filaProntos.queue(processoAtual);
                    processoAtual = null;
                }else processoAtual.tempoDecorrido++;
            }
        }

        while (processoAtual == null && this.filaProntos.length != 0) {
            let topo = this.filaProntos.dequeue();  

            memReal.atualizaReferencia(topo);
            if (!topo.verificaPaginas(memVirtual, this.qtdPaginas)) {
                if (this.tempoDisco == 0) {

                    memReal.alocaPaginas(processoAtual, topo, this.qtdPaginas, memVirtual);

                    topo.estado = "Espera - FP";
                    topo.tempoDecorrido = 1;
                    this.filaProntos.queue(topo);

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
                if(topo.deadlineAux < tempo) topo.estado = "Deadline";
                else topo.estado = "Execução";
                
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
        this.filaProntos.clear();
        this.filaDisco.esvaziar();
    }
}


export { EDF }