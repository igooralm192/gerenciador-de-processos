import React, { Component } from 'react';

class AddProcesso extends Component {
    componentDidMount() {
        $(".ui.dropdown").dropdown();
    }

    render() {
        return (
            <div className="ui grid">
                <div className="column">
                    <div className="ui form">
                        <div className="four fields">
                            <div className="field">
                                <label>Sobrecarga</label>
                                <input id="input-sobrecarga" type="number" min={0}/>
                            </div>
                            <div className="field">
                                <label>Quantum</label>
                                <input id="input-quantum" type="number" min={0}/>
                            </div>
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
                        </div>
                        <div className="ui divider"></div>
                        
                    </div>
                    <button className="ui green button" onClick={() => this.props.adicionaProcesso()}>Adicionar Processo</button>
           
                </div>

            </div>
            
        )
    }
}

export default AddProcesso;