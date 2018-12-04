import React, { Component } from 'react';
import { FIFO } from '../algoritmos/escalonamento/FIFO'
import { SJF } from '../algoritmos/escalonamento/SJF'
import { ROBIN } from '../algoritmos/escalonamento/ROBIN'
import { MemFIFO } from '../algoritmos/substituicao/FIFO'

import 'semantic-ui-range/range.css'
import 'semantic-ui-range/range.js'

class Execucao extends Component {
    constructor(props) {
        super(props);
        this.algoritmos = {
            escalonamento: {
                "FIFO": function(processos, qtdPaginas, tempoDisco) {
                    return new FIFO(processos, qtdPaginas, tempoDisco);
                },
                "SJF": function(processos, qtdPaginas, tempoDisco) {
                    return new SJF(processos, qtdPaginas, tempoDisco);
                },
                "RR": function(processos, qtdPaginas, tempoDisco) {
                    return new ROBIN(processos, qtdPaginas, tempoDisco);
                }
            },
            substituicao: {
                "FIFO": function() {
                    return new MemFIFO();
                }
            }
        }

        this.color = {
            "Execução": "#2ecc71",
            "Sobrecarga": "#e74c3c",
            "Espera - FP": "#fef160",
            "Espera - D": "#f4b350",
            "Disco": "#8c14fc",
            "Deadline": "#2e3131"
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
                execucao: null,
                memoriaReal: {
                    memoria: []
                },
                memoriaVirtual: []
            },
            processoAtual: null,
            estados: [],
            terminou: false,
        }

        this.redimensionar = this.redimensionar.bind(this);
        this.proximo = this.proximo.bind(this);
        this.alterarVelocidade = this.alterarVelocidade.bind(this);
        this.parar = this.parar.bind(this);
        this.setState = this.setState.bind(this);
    }

    componentDidMount() {  
        let algoritmos = this.algoritmos;
        let estruturas = this.state.estruturas;
        let redimensionar = this.redimensionar;
        let alterarVelocidade = this.alterarVelocidade;
        let parar = this.parar;
        let setState = this.setState;

        $(".ui.menu .item").tab({
            onVisible: function(path) {
                $("#velocidade").range('set value', 500);
                if (path === "Execução") {
                    redimensionar();
                    
                    setState((prevState, props) => {
                        let processos = props.processos;
                        let dadosEntrada = props.dadosEntrada;

                        estruturas.execucao = algoritmos.escalonamento[dadosEntrada.escalonamento](processos, dadosEntrada.qtdPaginas, dadosEntrada.tempoDisco);
                        estruturas.memoriaReal = algoritmos.substituicao[dadosEntrada.substituicao]();
                        estruturas.memoriaVirtual = Array(dadosEntrada.qtdPaginas*processos.length).fill(null)
                        console.log(estruturas)
                        return {estruturas};
                    });
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
            min: 0,
            max: 1000,
            start: 500,
            step: 1,
            onChange: (val) => alterarVelocidade(val)
        });

        
    }

    alterarVelocidade(val) {
        let iniciado = this.state.iniciado;

        if (iniciado) {
            clearInterval(this.state.intervalo)
            let intervalo = setInterval(this.proximo, 1000-val);
            this.setState({intervalo, velocidade: 1000-val});
        } else {
            this.setState({velocidade: 1000-val});
        }
    }

    redimensionar() {
        let translatado = this.state.translatado;
        let estados = this.state.estados;

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
            if (estados[i-1] != undefined) this.atualizarColuna(i-1, colunas, estados[i-1]);
        }


        $("#alcance").range({
            min: 0,
            max: Math.abs(translatado),
            step: 1,
            start: 0,
            onChange: (val) => $("#box-execucao, #box-tempo").scrollLeft(val)
        })
        
        $("#box-execucao, #box-tempo").scrollLeft(0)

        this.setState({colunas, totalIni})
    }

    proximo() {
        let tempo = this.state.tempo;
        let colunas = this.state.colunas;
        let translatado = this.state.translatado;
        let totalIni = this.state.totalIni;
        let velocidade = this.state.velocidade;
        let estados = this.state.estados;
        let estruturas = this.state.estruturas;
        let processos = this.props.processos;
        let qtdPaginas = this.props.dadosEntrada.qtdPaginas;
        let memoriaVirtual = estruturas.memoriaVirtual;
        let memoriaReal = estruturas.memoriaReal;
        let processoAtual = this.state.processoAtual;
        
        let [proxEstado, atual] = estruturas.execucao.proximoEstado(
            tempo, 
            processoAtual, 
            memoriaVirtual, 
            memoriaReal
        );

        console.log(memoriaVirtual, memoriaReal.memoria)
        console.log(tempo, proxEstado, processoAtual)

        let terminou = true;
        for (let i in proxEstado) {
            if (proxEstado[i] != "Acabou") {
                terminou = false;
                break;
            }
        }

        estados.push(proxEstado);

        if (terminou) return this.terminarExecucao(estados);

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

        this.atualizarColuna(tempo, colunas, proxEstado);

        this.setState({tempo: tempo+1, colunas, translatado, estados, processoAtual: atual}, () => {
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

    atualizarColuna(tempo, colunas, proxEstado) {
        let celulas = [];

        for (let i=0; i<this.props.processos.length; i++) {
            celulas.push((
                <div key={i} className="celula" style={{backgroundColor: this.color[proxEstado[i]]}}></div>
            ))
        }

        let coluna = React.createElement("div", {className: 'coluna'}, celulas);
        colunas.splice(tempo, 1, coluna);
    }

    iniciar() {
        let intervalo = setInterval(this.proximo, this.state.velocidade);
        this.setState({intervalo, iniciado: true});
    }

    pausar() {
        clearInterval(this.state.intervalo);
        this.setState({iniciado: false})
    }

    terminarExecucao(estados) {
        let total = 0;
        for (const i in estados) {
            let soma = 0;
            for (const j in estados[i]) {
                if (estados[i][j] == "Nada" || estados[i][j] == "Acabou") continue;
                soma++;
            }
            total += soma/this.props.processos.length;
        }
        
        alert('Turnaround Médio: '+total)

        clearInterval(this.state.intervalo);

        this.setState({iniciado: false, terminou: true});
    }

    parar() {
        clearInterval(this.state.intervalo);
        let alterarVelocidade = this.alterarVelocidade;
        let estruturas = this.state.estruturas;
        let processos = this.props.processos;
        let algoritmos = this.algoritmos;
        let { escalonamento, substituicao, qtdPaginas, tempoDisco } = this.props.dadosEntrada;
        
        for (let i in processos) {
            processos[i].tempoDecorrido = 1;
            processos[i].estado = "Nada";
        }

        estruturas.execucao = algoritmos.escalonamento[escalonamento](processos, qtdPaginas, tempoDisco);
        estruturas.memoriaReal = algoritmos.substituicao[substituicao]();
        estruturas.memoriaVirtual = Array(qtdPaginas*processos.length).fill(null)
        
        this.setState({
            iniciado: false,
            velocidade: 1000,
            tempo: 0,
            intervalo: null,
            translatado: 0,
            estruturas,
            iniciado: false,
            terminou: false,
            estados: [],
            processoAtual: null
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
                min: 0,
                max: 1000,
                start: 500,
                step: 1,
                onChange: (val) => alterarVelocidade(val)
            });
            this.redimensionar();
        })
    }

    scrollDown() {
        $("#box-ids").scrollTop($("#box-execucao").scrollTop()) 
    }

    render() {
        return (
            <div className="ui grid">
                <div className="">
                    <div className="column inline field">
                        <label id="tempo">Tempo: <span>{this.state.tempo-1}</span></label>
                    </div>
                </div>
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
                        <button className={`ui icon ${this.state.terminou?'disabled':''} button`} onClick={!this.state.iniciado?() => this.iniciar():() => this.pausar()}>
                            <i className={`${!this.state.iniciado?"play":"pause"} icon`}/>
                        </button>
                        <button className="ui icon button" onClick={() => this.parar()}>
                            <i className="stop icon"/>
                        </button>
                    </div>
                    
                    <div className="column">
                        <label>Velocidade: <span>{(1000-Math.floor(this.state.velocidade))/500}x</span></label>
                        <div id="velocidade" className="ui range"></div>
                    </div>
                    
                </div>

                <div className="row">
                    <div className="column">
                        <h3>Virtual</h3>
                        <div id="box-memoria-virtual">
                            {
                                this.state.estruturas.memoriaVirtual.map((r, i) => (
                                    <div key={i} className="celula-virtual">
                                        <div className="id">{i}</div>
                                        <div className="referencia">
                                            {r}
                                        </div>
                                        <div className="processo">P{Math.floor(i/this.props.dadosEntrada.qtdPaginas)+1}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    
                </div>
                <div className="row">  
                    <div className="column">
                        <h3>RAM</h3>
                        <div className="box-memoria">
                            {
                                this.state.estruturas.memoriaReal.memoria.map((val, i) => (
                                    <div key={i} className="celula-memoria">
                                        {val}
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