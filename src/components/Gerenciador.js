import React, { Component } from 'react';
import AddProcesso from './AddProcesso';
import MostraProcessos from './MostraProcessos';

class Gerenciador extends Component {
    constructor(props) {
        super(props);

        this.state = {
            idProcessos: [],
            processos: []
        }
    }

    componentDidMount() {
        $(".ui.menu .item").tab();
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
        let tc = parseInt($("#input-tempo-chegada").val());
        let te = parseInt($("#input-tempo-execucao").val());
        let d = parseInt($("#input-deadline").val());
        let p = parseInt($("#input-prioridade").val());

        if (isNaN(tc) || isNaN(te) || isNaN(d) || isNaN(p)) return;

        let idProcessos = this.state.idProcessos;
        let processos = this.state.processos;
        let menor = this.menorValor();

        idProcessos.push(menor);

        idProcessos.sort((a, b) => {
            return a - b;
        })
        
        processos.push({
            id: menor,
            tempoChegada: tc,
            tempoExecucao: te,
            deadline: d,
            prioridade: p
        })

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
        
        let ind = idProcessos.indexOf(i);
        processos.splice(ind, 1)
        idProcessos.splice(ind, 1);
        
        this.setState({idProcessos, processos})
    }

    render() {
        return (
            <div id="gerenciador" className="ui placeholder segment">
                <h1>Gerenciador de Processos</h1>
                <div className="ui pointing secondary menu">
                    <a className="active item" data-tab="Entrada">Entrada</a>
                    <a className="item" data-tab="Execução">Execução</a>
                </div>
                <div className="ui active tab" data-tab="Entrada">
                    <div className="ui grid">
						<div className="sixteen wide column">
							<AddProcesso adicionaProcesso={() => this.adicionaProcesso()}/>
						</div>
						{
							this.state.processos.length != 0 &&
							<div className="sixteen wide column">
								<MostraProcessos processos={this.state.processos} removeProcesso={(i) => this.removeProcesso(i)}/>
							</div>
						}
						
						
						<div className="sixteen wide column">
							<div className="ui form">
								<div className="three fields">
									
									<div className="field">
										<label>Escalonamento</label>
										<select className="ui fluid dropdown">
											<option value="FIFO">FIFO</option>
											<option value="SJF">SJF</option>
											<option value="EDF">EDF</option>
											<option value="RR">RR</option>
										</select>
									</div>
									<div className="field">
										<label>Substituição</label>
										<select className="ui fluid dropdown">
											<option value="FIFO">FIFO</option>
											<option value="MRU">MRU</option>
										</select>
									</div>
									<div id="btn-executar" className="field">
										<button className="ui fluid button">Executar</button>
									</div>
								</div>
							</div>
						</div>
                    </div>
                    
                </div>
                <div className="ui tab segment" data-tab="Execução">
                    Gameplay
                </div>
            </div>
        );
    }
}

export default Gerenciador;