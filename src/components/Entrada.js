import React, { Component } from 'react'
import MostraProcessos from './MostraProcessos';
import {Processo} from './Gerenciador'


class Entrada extends Component {
    constructor(props) {
        super(props);

        this.state = {
            idProcessos: [1, 2],
            processos: [
                new Processo(1, 0, 0, 0, 0),
                new Processo(2, 0, 0, 0, 0),
            ],
            dadosEntrada: {
                sobrecarga: 0,
                quantum: 0,
                escalonamento: "FIFO",
                substituicao: "FIFO"
            }
        }

        this.handleSobrecarga = this.handleSobrecarga.bind(this);
        this.handleQuantum = this.handleQuantum.bind(this);
        this.handleEscalonamento = this.handleEscalonamento.bind(this);
        this.handleSubstituicao = this.handleSubstituicao.bind(this);
    }

    componentDidMount() {
        $(".ui.dropdown").dropdown();
    }

    handleSobrecarga(e) {
        let val = e.target.value;
        let dadosEntrada = this.state.dadosEntrada;

        if (val == "") val = 0;
        val = parseInt(val)

        if (!isNaN(val)) {
            dadosEntrada.sobrecarga = val;
            this.setState({dadosEntrada})
        }
        
    }

    handleQuantum(e) {
        let val = e.target.value;
        let dadosEntrada = this.state.dadosEntrada;

        if (val == "") val = 0;
        val = parseInt(val)

        if (!isNaN(val)) {
            dadosEntrada.quantum = val;
            this.setState({dadosEntrada})
        }
    }

    handleEscalonamento(e) {
        let dadosEntrada = this.state.dadosEntrada;
        dadosEntrada.escalonamento = e.target.value;
        this.setState({dadosEntrada})
    }

    handleSubstituicao(e) {
        let dadosEntrada = this.state.dadosEntrada;
        dadosEntrada.substituicao = e.target.value;
        this.setState({dadosEntrada})
    }

    handleProcesso(e, id, input) {
        let op = ["tempoChegada", "tempoExecucao", "deadline", "prioridade"];
        let val = e.target.value;
        let processos = this.state.processos;

        if (val == "") val = 0;
        val = parseInt(val)

        if (!isNaN(val)) {
            processos[id-1][ op[input-1] ] = val;
            this.setState({processos})
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
        
        processos.push(new Processo(menor, 0, 0, 0, 0))

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

    

    render() {
        return (
            <div className="ui grid">
                <div className="sixteen wide column">
                    <div className="ui grid">
                        <div className="column">
                            <div className="ui form">
                                <div className="four fields">
                                    <div className="field">
                                        <label>Sobrecarga</label>
                                        <input id="input-sobrecarga" onChange={(e) => this.handleSobrecarga(e)} value={this.state.dadosEntrada.sobrecarga}/>
                                    </div>
                                    <div className="field">
                                        <label>Quantum</label>
                                        <input id="input-quantum" onChange={(e) => this.handleQuantum(e)} value={this.state.dadosEntrada.quantum}/>
                                    </div>
                                    <div className="field">
                                        <label>Escalonamento</label>
                                        <select className="ui fluid dropdown" onChange={(e) => this.handleEscalonamento(e)}>
                                            <option value="FIFO">FIFO</option>
                                            <option value="SJF">SJF</option>
                                            <option value="EDF">EDF</option>
                                            <option value="RR">RR</option>
                                        </select>
                                    </div>
                                    <div className="field">
                                        <label>Substituição</label>
                                        <select className="ui fluid dropdown" onChange={(e) => this.handleSubstituicao(e)}>
                                            <option value="FIFO">FIFO</option>
                                            <option value="MRU">MRU</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="ui divider"></div>
                                
                            </div>
                            <button className="ui green button" onClick={() => this.adicionaProcesso()}>Adicionar Processo</button>
                
                        </div>

                    </div>
                </div>
                <div className="sixteen wide column">
                    <MostraProcessos processos={this.state.processos} removeProcesso={(i) => this.removeProcesso(i)} onChange={(e, id, inp) => this.handleProcesso(e, id, inp)}/>
                </div>
            
                <div id="btn-executar">
                    <button className="ui fluid button" onClick={() => this.props.executar(this.state)}>Executar</button>
                </div>
            </div>
        );
    }
}

export default Entrada;