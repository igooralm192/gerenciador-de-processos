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
                                    <input onChange={(e) => this.props.onChange(e, this.props.processo.id, 1)} value={this.props.processo.tempoChegada}/>
                                </div>
                                <div className="field">
                                    <label>Tempo de Execução</label>
                                    <input onChange={(e) => this.props.onChange(e, this.props.processo.id, 2)} value={this.props.processo.tempoExecucao}/>
                                </div>
                            </div>
                            <div className="two fields">
                                <div className="field">
                                    <label>Deadline</label>
                                    <input onChange={(e) => this.props.onChange(e, this.props.processo.id, 3)} value={this.props.processo.deadline}/>
                                </div>
                                <div className="field">
                                    <label>Prioridade</label>
                                    <input onChange={(e) => this.props.onChange(e, this.props.processo.id, 4)} value={this.props.processo.prioridade}/>
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