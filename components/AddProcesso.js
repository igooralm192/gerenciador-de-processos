import React, { Component } from 'react';

class AddProcesso extends Component {
    componentDidMount() {
        $(".ui.dropdown").dropdown();
    }

    render() {
        return (
            <div className="ui grid">
                <div className="ten wide column">
                    <div className="ui form">
                        <div className="two fields">
                            <div className="field">
                                <label>Tempo de Chegada</label>
                                <input id="input-tempo-chegada" type="number" min={0}/>
                            </div>
                            <div className="field">
                                <label>Tempo de Execução</label>
                                <input id="input-tempo-execucao" type="number" min={0}/>
                            </div>
                        </div>
                        <div className="two fields">
                            <div className="field">
                                <label>Deadline</label>
                                <input id="input-deadline" type="number" min={0}/>
                            </div>
                            <div className="field">
                                <label>Prioridade</label>
                                <input id="input-prioridade" type="number" min={0}/>
                            </div>
                        </div>
                    </div>
                    <button className="ui green button" onClick={() => this.props.adicionaProcesso()}>Adicionar Processo</button>
           
                </div>

                
                <div className="six wide right floated column">
                    <div className="ui form">
                        <div className="field">
                            <label>Sobrecarga</label>
                            <input id="input-sobrecarga" type="number" min={0}/>
                        </div>
                        <div className="field">
                            <label>Quantum</label>
                            <input id="input-quantum" type="number" min={0}/>
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
}

export default AddProcesso;