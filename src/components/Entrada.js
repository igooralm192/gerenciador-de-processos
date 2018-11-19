import React, { Component } from 'react'
import AddProcesso from './AddProcesso';
import MostraProcessos from './MostraProcessos';

class Processo {
    constructor(id, tc, te, d, p) {
        this.id = id;
        this.tempoChegada = tc;
        this.tempoExecucao = te;
        this.deadline = d;
        this.prioridade = p;
    }
}

class Entrada extends Component {
    constructor(props) {
        super(props);

        this.state = {
            idProcessos: [1, 2],
            processos: [
                new Processo(1, null, null, null, null),
                new Processo(2, null, null, null, null),
            ]
        }
    }

    menorValor() {
        let idProcessos = this.state.idProcessos;
        let menor = 1;

        while (1) {
            let ind = idProcessos.indexOf(menor);
            if (ind == -1) break;
            menor++;
        }

        return menor;
    }

    adicionaProcesso() {
        let idProcessos = this.state.idProcessos;
        let processos = this.state.processos;
        let menor = this.menorValor();

        idProcessos.push(menor);

        idProcessos.sort((a, b) => {
            return a - b;
        })
        
        processos.push(new Processo(menor, null, null, null, null),)

        processos.sort((a, b) => {
            return a.id - b.id;
        })

        this.setState({
            idProcessos,
            processos
        })
    }

    removeProcesso(i) {
        let idProcessos = this.state.idProcessos;
        let processos = this.state.processos;

        if (idProcessos.length == 2) return;
        
        let ind = idProcessos.indexOf(i);
        processos.splice(ind, 1)
        idProcessos.splice(ind, 1);
        
        this.setState({idProcessos, processos})
    }

    executar() {
        $(".ui.menu .item").tab('change tab', 'Execução');
    }

    render() {
        return (
            <div className="ui grid">
                <div className="sixteen wide column">
                    <AddProcesso adicionaProcesso={() => this.adicionaProcesso()}/>
                </div>
                <div className="sixteen wide column">
                    <MostraProcessos processos={this.state.processos} removeProcesso={(i) => this.removeProcesso(i)}/>
                </div>
            
                <div id="btn-executar">
                    <button className="ui fluid button" onClick={() => this.executar()}>Executar</button>
                </div>
            </div>
        );
    }
}

export default Entrada;