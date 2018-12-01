import React, { Component } from 'react';
import Execucao from './Execucao';
import Entrada from './Entrada';
import Processo from '../estruturas/Processo'

class Gerenciador extends Component {
    constructor(props) {
        super(props);

        this.state = {
            processos: [
                new Processo(1, 0, 0, 0, 0),
                new Processo(2, 0, 0, 0, 0),
            ],
            dadosEntrada: {
                sobrecarga: 0,
                quantum: 0,
                escalonamento: "FIFO",
                substituicao: "FIFO",
                qtdPaginas: 7
            }
        }
    }

    executar(dados) {
        this.setState({processos: dados.processos, dadosEntrada: dados.dadosEntrada}, () => {
            $(".ui.menu .item").tab('change tab', 'Execução');
        })
    }

    render() {
        return (
            <div id="gerenciador" className="ui segment">
                <h1>Gerenciador de Processos</h1>
                <div className="ui pointing secondary menu">
                    <a className="active item" data-tab="Entrada">Entrada</a>
                    <a className="item" data-tab="Execução">Execução</a>
                </div>
                <div className="ui active tab" data-tab="Entrada">
                    <Entrada executar={(p) => this.executar(p)}/>
                </div>
                <div className="ui tab" data-tab="Execução">
                    <Execucao processos={this.state.processos} dadosEntrada={this.state.dadosEntrada}/>
                </div>
            </div>
        );
    }
}

export default Gerenciador;
