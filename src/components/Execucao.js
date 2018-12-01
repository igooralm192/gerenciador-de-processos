import React, { Component } from 'react';
import PriorityQueue from 'priority-queue-js';

import 'semantic-ui-range/range.css'
import 'semantic-ui-range/range.js'

// EX - Execução
// ES - Espera
// DI - Disco
// S - Sobrecarga
// DE - Deadline

class Execucao extends Component {
    constructor(props) {
        super(props);
        
        this.escalonamentos = {
            "FIFO": new PriorityQueue({
                comparator: (a, b) => {return a - b;}
            })
        }
        this.state = {
            iniciado: false,
            velocidade: 1000,
            colunas: [],
            tempo: 0,
            intervalo: null,
            translatado: 0,
            totalIni: 0,

            estruturas: {
                filaProntos: [],
                memoriaReal: [],
                memoriaVirtual: []
            }
        }

        this.redimensionar = this.redimensionar.bind(this);
        this.proximo = this.proximo.bind(this);
        this.alterarVelocidade = this.alterarVelocidade.bind(this);
        this.parar = this.parar.bind(this);
        this.setState = this.setState.bind(this);
    }

    componentDidMount() {        
        let escalonamento = this.props.dadosEntrada.escalonamento;
        let substituicao = this.props.dadosEntrada.substituicao;
        let estruturas = this.state.estruturas;
        let redimensionar = this.redimensionar;
        let alterarVelocidade = this.alterarVelocidade;
        let parar = this.parar;
        let setState = this.setState;

        $(".ui.menu .item").tab({
            onVisible: function(path) {
                $("#velocidade").range('set value', 1000);
                if (path === "Execução") {
                    redimensionar();

                    estruturas.filaProntos = this.escalonamento[escalonamento];
                    setState({estruturas});
                } else parar();
            }
        });

        $(window).resize(function() {
            redimensionar();
        });

        $("#alcance").range({
            min: 0,
            max: 0,
            step: 1,
            start: 0,
            onChange: (val) => $("#box-execucao, #box-tempo").scrollLeft(val)
        });

        $("#velocidade").range({
            min: 100,
            max: 2000,
            start: 1000,
            step: 10,
            onChange: (val) => alterarVelocidade(val)
        });

        
    }

    alterarVelocidade(val) {
        let iniciado = this.state.iniciado;

        if (iniciado) {
            clearInterval(this.state.intervalo)
            let intervalo = setInterval(this.proximo, val);
            this.setState({intervalo, velocidade: val});
        } else {
            this.setState({velocidade: val});
        }
    }

    redimensionar() {
        let translatado = this.state.translatado;

        let largura = document.getElementById("box-execucao").clientWidth;
        let totalIni = parseInt(largura/40 + (largura%40>0));

        let colunas = [];

        for (let i=1; i<=totalIni+Math.abs(translatado)/40; i++) {
            colunas.push((
                <div className="coluna">
                    {
                        this.props.processos.map((p, j) => (
                            <div key={j} className="celula"></div>
                        ))
                    }
                </div>
            ))
        }


        $("#alcance").range({
            min: 0,
            max: Math.abs(translatado),
            step: 1,
            start: Math.abs(translatado),
            onChange: (val) => $("#box-execucao, #box-tempo").scrollLeft(val)
        })

        $("#box-execucao").animate({
            scrollLeft: Math.abs(translatado)
        }, this.state.velocidade/2)

        this.setState({colunas, totalIni})
    }

    proximo() {
        let tempo = this.state.tempo;
        let colunas = this.state.colunas;
        let translatado = this.state.translatado;
        let totalIni = this.state.totalIni;
        let velocidade = this.state.velocidade;
        let estruturas = this.state.estruturas;
        let processos = this.props.processos;
        let qtdPaginas = this.props.dadosEntrada.qtdPaginas;
        let memoriaVirtual = this.state.memoriaVirtual;
        let memoriaReal = this.state.memoriaReal;

        for (let i=0; i<processos.length; i++) {
            if (processos[i].tempoChegada == tempo) {
                estruturas.filaProntos.push(processos[i]);
            }
        }

        if (estruturas.filaProntos.length != 0) {
            let topo = estruturas.filaProntos.peek();

            for (let i=0; i<processos.length; i++) {
            
                if (processos[i] == topo) {

                }
                let atual = estruturas.filaProntos.pop();
                
                if (!atual.verificarPaginas(memoriaVirtual, qtdPaginas)) {
                    atual.estado = "D";
                } 
            }
        }
        

        

        for (let i=0; i<processos.length; i++) {
            if (atual == processos[i]) {

            }
        }

        if (tempo >= (totalIni-1)/2+1) {
            translatado += 40;
        }

        if (tempo >= (totalIni-1)/2) {
            colunas.push((
                <div className="coluna">
                    {
                        this.props.processos.map((p, j) => (
                            <div key={j} className="celula"></div>
                        ))
                    }
                </div>
            ))
        }

        this.setState({tempo: tempo+1, colunas, translatado}, () => {
            if (tempo >= (totalIni-1)/2+1) {
                
                $("#box-execucao, #box-tempo").animate({
                    scrollLeft: Math.abs(translatado)
                }, velocidade/2)
    
                $("#alcance").range({
                    min: 0,
                    max: Math.abs(translatado),
                    step: 1,
                    start: Math.abs(translatado),
                    onChange: (val) => $("#box-execucao, #box-tempo").scrollLeft(val)
                })
    
            }
        })
        
    }

    iniciar() {
        let intervalo = setInterval(this.proximo, this.state.velocidade);
        this.setState({intervalo, iniciado: true});
    }

    pausar() {
        clearInterval(this.state.intervalo);
        this.setState({iniciado: false})
    }

    parar() {
        clearInterval(this.state.intervalo);
        let alterarVelocidade = this.alterarVelocidade;

        this.setState({
            iniciado: false,
            velocidade: 1000,
            tempo: 0,
            intervalo: null,
            translatado: 0,
        }, () => {
            $("#box-execucao, #box-tempo").stop();
            $("#box-execucao, #box-tempo").scrollLeft(0);
            
            $("#alcance").range({
                min: 0,
                max: 0,
                step: 1,
                start: 0,
                onChange: (val) => $("#box-execucao, #box-tempo").scrollLeft(val)
            });
    
            $("#velocidade").range({
                min: 100,
                max: 2000,
                start: 1000,
                step: 10,
                onChange: (val) => alterarVelocidade(val)
            });

            
        })
    }

    scrollDown() {
        $("#box-ids").scrollTop($("#box-execucao").scrollTop()) 
    }

    render() {
        return (
            <div className="ui grid">
                <div className="row">
                    <div className="sixteen wide column">
                        <div id="box-exibicao">
                            <div id="box-ids">
                                {
                                    this.props.processos.map((p, i) => (
                                        <div key={i} className="id-processo">P{p.id}</div>
                                    ))
                                }
                            </div>
                            <div id="box-sla">
                                <div id="box-tempo">
                                    {
                                        this.state.colunas.map((col, i) => (
                                            <div className="coluna tempo">
                                                <div className="celula ">{i}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div id="box-execucao" onScroll={() => this.scrollDown()}>
                                    {
                                        this.state.colunas.map(col => (
                                            col
                                        ))
                                    }
                                </div>
                            </div>
                            
                        </div>                                                
                    </div>
                </div>
                <div className="row">
                    <div id="alcance" className="ui range"></div>
                </div>
                        
                <div className="two column row">
                    <div className="column">
                        <button className={`ui icon button`} onClick={!this.state.iniciado?() => this.iniciar():() => this.pausar()}>
                            <i className={`${!this.state.iniciado?"play":"pause"} icon`}/>
                        </button>
                        <button className="ui icon button" onClick={() => this.parar()}>
                            <i className="stop icon"/>
                        </button>
                    </div>
                    
                    <div className="column">
                        <label>Velocidade: <span>{this.state.velocidade/1000}x</span></label>
                        <div id="velocidade" className="ui range"></div>
                    </div>
                    
                </div>

                <div className="row">
                    <div className="column">
                        <h3>RAM</h3>
                        <div id="box-memoria" className="">
                            {
                                Array(50).fill(null).map((val, i) => (
                                    <div className="celula-memoria">
                                        {i+1}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Execucao;