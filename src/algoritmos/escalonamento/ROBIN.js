import PriorityQueue from 'js-priority-queue'
import { Fila } from '../../estruturas/Fila';

class ROBIN {
    constructor(processos, qtdPaginas, tempoDisco) {
        this.processos = processos;
        this.qtdPaginas = qtdPaginas;
        this.tempoDisco = tempoDisco;
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
        let terminou = true;
        let estados = [];
        
        for (const i in this.processos) {
            if (this.processos[i].tempoChegada == tempo) {

                this.processos[i].estado = "Espera - FP";
                this.processos[i].tempoDecorrido = 1;
                //this.filaProntos.queue(this.processos[i])
                this.filaProntos.push(this.processos[i]);
            }
        }

        /*if (processoAtual != null) {
            if (processoAtual.estado == "Execução") {
                if (processoAtual.tempoDecorrido == processoAtual.tempoExecucao) {
                    processoAtual.estado = "Acabou"
                    processoAtual = null;
                } else processoAtual.tempoDecorrido++;
            }
        }*/

        if (processoAtual != null) {
            //alert('tempo execucao'+processoAtual.tempoExecucao)
            //alert('tempo decorrido'+processoAtual.tempoDecorrido)
            if (processoAtual.estado == "Execução") {
                if ((processoAtual.tempoDecorrido == 2 /*quantum*/) && (processoAtual.tempoExecucao > 1)) {
                    //alert('aviso 47')
                    processoAtual.estado = "Sobrecarga";
                    processoAtual.tempoDecorrido = 1;
                    processoAtual.tempoExecucao--;
                    /*this.filaProntos.push(processoAtual);
                    processoAtual = null;*/
                } else if ((processoAtual.tempoDecorrido < 2 /*quantum*/) && (processoAtual.tempoExecucao > 1)) {
                    //alert('aviso 52')
                    processoAtual.tempoDecorrido++;
                    processoAtual.tempoExecucao--;
                }else if (processoAtual.tempoExecucao == 1){
                    //alert('aviso ')
                    processoAtual.estado = "Acabou"
                    processoAtual = null;
                }
            }else if(processoAtual.estado == "Sobrecarga"){
                if(processoAtual.tempoDecorrido == 1 /*sobrecarga*/){
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
                topo.tempoDecorrido = 0;
                this.filaProntos.push(topo);
                //this.filaProntos.queue(topo);
            } else topo.tempoDecorrido++;
        }

        while (processoAtual == null && this.filaProntos.length() != 0 && this.filaDisco.vazio()) {
            let topo = this.filaProntos.topo();
            this.filaProntos.pop();
            //let topo = this.filaProntos.dequeue();  

            if (!topo.verificaPaginas(memVirtual, this.qtdPaginas)) {
                if (this.tempoDisco == 0) {

                    memReal.alocaPaginas(processoAtual, topo, this.qtdPaginas, memVirtual);

                    topo.estado = "Espera - FP";
                    topo.tempoDecorrido = 1;
                    this.filaProntos.push(topo);
                    //this.filaProntos.queue(topo);

                } else {
                    topo.estado = "Disco";
                    this.filaDisco.push(topo);
                    break;
                }
            } else {
                topo.estado = "Execução"
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

        return [estados, processoAtual]
    }

    limpar() {
        this.filaProntos.esvaziar();
        this.filaDisco.esvaziar();
    }
}


export { ROBIN }