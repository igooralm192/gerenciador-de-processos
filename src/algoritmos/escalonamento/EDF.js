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
                if (a.deadline == b.deadline) {
                    if (a.tempoChegada == b.tempoChegada) return a.id - b.id;
                    return a.tempoChegada - b.tempoChegada
                }
                return a.deadline - b.deadline;
            }
        });
        this.filaDisco = new Fila();
    }

    proximoEstado(tempo, processoAtual, memVirtual, memReal) {
        let terminou = true;
        let estados = [];
        
        for (const i in this.processos) {
            if (this.processos[i].tempoChegada == tempo) {

                this.processos[i].estado = "Espera - FP";
                this.processos[i].tempoDecorrido = 1;
                this.filaProntos.queue(this.processos[i])
            }
        }

        /*if (processoAtual != null) {
            if (processoAtual.estado == "Execução") {
                if (processoAtual.tempoDecorrido == processoAtual.tempoExecucaoAux) {
                    processoAtual.estado = "Acabou"
                    processoAtual = null;
                } else processoAtual.tempoDecorrido++;
            }
        }*/

        if (processoAtual != null) {
            /*alert('tempo execucao '+processoAtual.tempoExecucaoAux)
            alert('tempo decorrido '+processoAtual.tempoDecorrido)
            alert('quantum '+this.quantum)*/
            if (processoAtual.estado == "Execução") {
                //alert('execucao')
                if ((processoAtual.tempoDecorrido == this.quantum) && (processoAtual.tempoExecucaoAux > 0)) {
                    //alert('sobrecarga')
                    processoAtual.estado = "Sobrecarga";
                    processoAtual.tempoDecorrido = 1;

                } else if ((processoAtual.tempoDecorrido < this.quantum) && (processoAtual.tempoExecucaoAux > 0)) {
                    //alert('modificar')
                    processoAtual.tempoDecorrido++;
                    processoAtual.tempoExecucaoAux--;
                }else if (processoAtual.tempoExecucaoAux == 0){
                    //alert('finalizar')
                    processoAtual.estado = "Acabou"
                    processoAtual = null;
                }
            } else if(processoAtual.estado == "Sobrecarga"){
                if(processoAtual.tempoDecorrido == this.sobrecarga){
                    processoAtual.estado = "Espera - FP";
                    processoAtual.tempoDecorrido = 1;
                    //this.filaProntos.push(processoAtual);
                    this.filaProntos.queue(processoAtual);
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
                this.filaProntos.queue(topo);

                if (!this.filaDisco.vazio()) {
                    let topo = this.filaDisco.topo();

                    topo.estado = "Disco";
                    topo.tempoDecorrido = 1;
                }
            } else topo.tempoDecorrido++;
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
                    //console.log('oiii')
                    topo.tempoDecorrido = 1;
                    if (this.filaDisco.vazio()) {
                        //console.log('vazioo')
                        topo.estado = "Disco";
                        this.filaDisco.push(topo);
                    } else {
                        //console.log('nao vazioo')
                        topo.estado = "Espera - D";
                        this.filaDisco.push(topo);
                    }
                }
            } else {
                topo.estado = "Execução";
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