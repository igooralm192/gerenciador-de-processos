class Processo {
    constructor(id, tc, te, d, p) {
        this.id = id;
        this.tempoChegada = tc;
        this.tempoExecucao = te;
        this.tempoExecucaoAux = te;
        this.deadline = d;
        this.deadlineAux = d;
        this.prioridade = p;
        this.tempoDecorrido = 1;
        this.estado = "Nada";
    }

    verificaPaginas(memoriaVirtual, qtdPaginas) {
        let ini = (this.id-1)*qtdPaginas;

        for (let j=ini; j<ini+qtdPaginas; j++) {
            if (memoriaVirtual[j] == null) return false;
        }

        return true;
    }
}

export default Processo;