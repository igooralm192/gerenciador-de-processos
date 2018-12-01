class Processo {
    constructor(id, tc, te, d, p) {
        this.id = id;
        this.tempoChegada = tc;
        this.tempoExecucao = te;
        this.deadline = d;
        this.prioridade = p;
        this.estado = null
    }

    verificarPaginas(memoriaVirtual, qtdPaginas) {
        let ini = id*qtdPaginas;

        for (let j=ini; j<ini+qtdPaginas; j++) {
            if (memoriaVirtual[j] == null) return false;
        }

        return true;
    }
}

export default Processo;