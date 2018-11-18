import React, { Component } from 'react';

class Processo extends Component {

    render() {
        return (
            <div id={`processo${this.props.processo.id}`} className="ui card">
                <div className="center aligned content">
                    <a className="header">Processo {this.props.processo.id}</a>
                    <div className="description">
                        <div className="ui form">
                            <div className="two fields">
                                <div className="field">
                                    <label>Tempo de Chegada</label>
                                    <input type="number" min={0} defaultValue={this.props.processo.tempoChegada}/>
                                </div>
                                <div className="field">
                                    <label>Tempo de Execução</label>
                                    <input type="number" min={0} defaultValue={this.props.processo.tempoExecucao}/>
                                </div>
                            </div>
                            <div className="two fields">
                                <div className="field">
                                    <label>Deadline</label>
                                    <input type="number" min={0} defaultValue={this.props.processo.deadline}/>
                                </div>
                                <div className="field">
                                    <label>Prioridade</label>
                                    <input type="number" min={0} defaultValue={this.props.processo.prioridade}/>
                                </div>
                            </div>
                        </div>
                        <button className="ui fluid red button" onClick={() => this.props.removeProcesso(this.props.processo.id)}>Remover</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Processo;