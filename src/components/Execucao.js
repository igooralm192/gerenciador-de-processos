import React, { Component } from 'react';
import 'semantic-ui-range/range.css'
import 'semantic-ui-range/range.js'
class Execucao extends Component {
    constructor(props) {
        super(props);

        console.log(props)
        
        this.state = {
            iniciado: false,
            velocidade: 1000,
            colunas: [],
            tempo: 0,
            intervalo: null,
            translatado: 0,
            totalIni: 0,
        }

        this.redimensionar = this.redimensionar.bind(this);
        this.proximo = this.proximo.bind(this);
        this.alterarVelocidade = this.alterarVelocidade.bind(this);
    }

    componentDidMount() {        
        let redimensionar = this.redimensionar;
        let alterarVelocidade = this.alterarVelocidade;

        $(".ui.menu .item").tab({
            onVisible: function(path) {
                $("#velocidade").range('set value', 1000);
                if (path === "Execução") redimensionar();
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
            onChange: (val) => $("#box-execucao").scrollLeft(val)
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
        console.log(iniciado, val)
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
                    <div className="celula tempo">{i-1}</div>
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
            onChange: (val) => $("#box-execucao").scrollLeft(val)
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

        console.log(tempo, totalIni)

        if (tempo >= (totalIni-1)/2+1) {
            translatado += 40;
        }

        if (tempo >= (totalIni-1)/2) {
            colunas.push((
                <div className="coluna">
                    <div className="celula tempo">{colunas.length}</div>
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
                
                $("#box-execucao").animate({
                    scrollLeft: Math.abs(translatado)
                }, velocidade/2)
    
                $("#alcance").range({
                    min: 0,
                    max: Math.abs(translatado),
                    step: 1,
                    start: Math.abs(translatado),
                    onChange: (val) => $("#box-execucao").scrollLeft(val)
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
                                <div className="id-processo"></div>
                                {
                                    this.props.processos.map((p, i) => (
                                        <div key={i} className="id-processo">P{p.id}</div>
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
                <div className="row">
                    <div id="alcance" className="ui range"></div>
                </div>
                        
                <div className="two column row">
                    <div className="column">
                        <button className="ui icon  button" onClick={() => this.iniciar()}>
                            <i className="play icon"/>
                        </button>
                        <button className="ui icon button" onClick={() => this.pausar()}>
                            <i className="pause icon"/>
                        </button>
                    </div>
                    
                    <div className="column">
                        <label>Velocidade: <span>{this.state.velocidade/1000}x</span></label>
                        <div id="velocidade" className="ui range"></div>
                    </div>
                    
                </div>
                
            </div>
        )
    }
}

export default Execucao;