import PriorityQueue from 'js-priority-queue'
import { Fila } from '../../estruturas/Fila';

class SJF {
    constructor(processos, dados) {
        this.processos = processos;
        this.qtdPaginas = dados.qtdPaginas;
        this.tempoDisco = dados.tempoDisco;
        this.filaProntos = new PriorityQueue({
            comparator: (a, b) => {
                if (a.tempoExecucao == b.tempoExecucao) {
                    if (a.tempoChegada == b.tempoChegada) return a.id - b.id;
                    return a.tempoChegada - b.tempoChegada
                }
                return a.tempoExecucao - b.tempoExecucao;
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
            if (processoAtual.estado == "Execução") {
                if (processoAtual.tempoDecorrido == processoAtual.tempoExecucao) {
                    processoAtual.estado = "Acabou"
                    processoAtual = null;
                } else processoAtual.tempoDecorrido++;
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
                topo.estado = "Execução";
                
                if (topo.tempoExecucao == 0) {
                    topo.estado = "Acabou";
                    processoAtual = null;
                } else {
                    topo.tempoDecorrido = 1;
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


export { SJF }