import React, { Component } from 'react'
import MostraProcessos from './MostraProcessos';
import Processo from '../estruturas/Processo'


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
                qtdPaginas: 0,
                tempoDisco: 0,
                escalonamento: "FIFO",
                substituicao: "FIFO"
            }
        }

        this.handleSobrecarga = this.handleSobrecarga.bind(this);
        this.handleQuantum = this.handleQuantum.bind(this);
        this.handleQtdPaginas = this.handleQtdPaginas.bind(this);
        this.handleTempoDisco = this.handleTempoDisco.bind(this);
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

    handleQtdPaginas(e) {
        let val = e.target.value;
        let dadosEntrada = this.state.dadosEntrada;

        if (val == "") val = 0;
        val = parseInt(val)

        if (!isNaN(val)) {
            dadosEntrada.qtdPaginas = val;
            this.setState({dadosEntrada})
        }
    }

    handleTempoDisco(e) {
        let val = e.target.value;
        let dadosEntrada = this.state.dadosEntrada;

        if (val == "") val = 0;
        val = parseInt(val)

        if (!isNaN(val)) {
            dadosEntrada.tempoDisco = val;
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
            if(op[input-1] == "tempoExecucao"){
                processos[id-1][ "tempoExecucaoAux" ] = val;
            }
            if(op[input-1] == "deadline"){
                processos[id-1][ "deadlineAux" ] = val;
            }
            processos[id-1][ op[input-1] ] = val;
            this.setState({processos})
        }
    }

    entradaCompleta() {
        let val = $("#input-entrada-completa").val().split("\n");
        let idProcessos = []
        let processos = [];
        
        $("#processos").css({
            width: "7px"
        })

        for (let i in val) {
            i = parseInt(i);
            let [ tc, te, d, p ] = val[i].split(' ');
            let processo = new Processo(
                i+1, 
                isNaN(parseInt(tc))?0:parseInt(tc), 
                isNaN(parseInt(te))?0:parseInt(te), 
                isNaN(parseInt(d))?0:parseInt(d), 
                isNaN(parseInt(p))?0:parseInt(p));
            
            idProcessos.push(i+1);
            processos.push(processo);
            $("#processos").css({
                width: "+=214px"
            })
            
            
        }

        while (processos.length < 2) {
            idProcessos.push(processos.length+1);
            processos.push(new Processo(processos.length+1, 0, 0, 0, 0))
            $("#processos").css({
                width: "+=214px"
            })
        }

        $(".ui.modal").modal('hide')
        this.setState({idProcessos, processos})
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

        $("#processos").css({
            width: "+=214px"
        })

        console.log( )

        $("#box-processos").scrollLeft( document.getElementById('box-processos').scrollWidth - document.getElementById('box-processos').clientWidth )

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

        $("#processos").css({
            width: "-=214px"
        })

        for (let i in processos) {
            processos[i].id = parseInt(i)+1;
            idProcessos[i] = parseInt(i)+1;
        }

        
        this.setState({idProcessos, processos})
    }

    

    render() {
        return (
            <div className="ui grid">
                <div className="sixteen wide column">
                    <div className="ui grid">
                        <div className="column">
                            <div className="ui form">
                                <div className="six fields">
                                    <div className="field">
                                        <label>Sobrecarga</label>
                                        <input id="input-sobrecarga" onChange={(e) => this.handleSobrecarga(e)} value={this.state.dadosEntrada.sobrecarga}/>
                                    </div>
                                    <div className="field">
                                        <label>Quantum</label>
                                        <input id="input-quantum" onChange={(e) => this.handleQuantum(e)} value={this.state.dadosEntrada.quantum}/>
                                    </div>
                                    
                                    <div className="field">
                                        <label>Qtd. Páginas</label>
                                        <input id="input-qtdpaginas" onChange={(e) => this.handleQtdPaginas(e)} value={this.state.dadosEntrada.qtdPaginas}/>
                                    </div>
                                    <div className="field">
                                        <label>Tempo no Disco</label>
                                        <input id="input-tempo-disco" onChange={(e) => this.handleTempoDisco(e)} value={this.state.dadosEntrada.tempoDisco}/>
                                    </div>
                                    <div className="field">
                                        <label>Escalonamento</label>
                                        <select className="ui fluid dropdown" onChange={(e) => this.handleEscalonamento(e)}>
                                            <option value="FIFO">FIFO</option>
                                            <option value="SJF">SJF</option>
                                            <option value="RR">RR</option>
                                            <option value="EDF">EDF</option>
                                            <option value="PS">PS</option>
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
                            <button className="ui grey button" onClick={() => $('.ui.modal').modal('show')}>Entrada Completa</button>
                        </div>

                    </div>
                </div>
                <div className="sixteen wide column">
                    <MostraProcessos processos={this.state.processos} removeProcesso={(i) => this.removeProcesso(i)} onChange={(e, id, inp) => this.handleProcesso(e, id, inp)}/>
                </div>
            
                <div id="btn-executar">
                    <button className="ui fluid button" onClick={() => this.props.executar(this.state)}>Executar</button>
                </div>

                <div className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">Entrada Completa</div>
                    <div className="content">
                        <h4>Formato:</h4> 
                        <p>TempoChegada  TempoExecução  Deadline  Prioridade</p>
                        <p>Ex: 0 6 15 1</p>
                        <div className="ui form">
                            <div className="field">
                                <textarea id="input-entrada-completa"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="actions">
                        <div className="ui green button" onClick={() => this.entradaCompleta()}>Enviar</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Entrada;