import React, { Component } from 'react';
import Execucao from './Execucao';
import Entrada from './Entrada';

class Gerenciador extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }
    }

    componentDidMount() {
        $(".ui.menu .item").tab();
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
                    <Entrada/>
                </div>
                <div className="ui tab" data-tab="Execução">
                    <Execucao/>
                </div>
            </div>
        );
    }
}

export default Gerenciador;