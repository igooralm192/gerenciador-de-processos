import React, { Component } from 'react';
import Processo from './Processo';

class MostraProcessos extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2>Processos</h2>
                <div className="ui secondary segment">
                    <div id="processes" className="ui cards">
                        {
                            this.props.processos.map((processo, i) => (
                                <Processo key={i} processo={processo} removeProcesso={(i) => this.props.removeProcesso(i)}/>
                            ))
                        }
                    </div>
                </div>
            </div>
            
        )
    }
}

export default MostraProcessos;