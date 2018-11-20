import React, { Component } from 'react';
import 'semantic-ui-range/range.css'
import 'semantic-ui-range/range.js'
class Execucao extends Component {
    constructor(props) {
        super(props);

        var arr = [];

        for (let i=1; i<=20; i++) {
            arr.push((
                <div className="col">
                    <div id="mycel" className="cell">
                        oi
                    </div>
                    <div className="cell">
                        oi
                    </div>
                    <div className="cell">
                        oi
                    </div>
                    <div className="cell">
                        oi
                    </div>
                </div>
            ))
        }

        this.state = {
            cols: arr,
            valueRange: 0
        }

        this.resizeRange = this.resizeRange.bind(this);
    }
    onRange(e) {
        let val = e.target.value
        console.log("onRange")
        $(".cell").css({
            transition: 'all 0s',
            transform: "translate(-"+val+"px)"
        })
        
        this.setState({valueRange: val})
    }

    resizeRange() {
        let width = document.getElementById("box-execucao").clientWidth;
        
        let tot = parseInt(width/40 + (width%40>0));

        let arr = [];

        for (let i=1; i<=tot; i++) {
            arr.push((
                <div className="col">
                    <div id="mycel" className="cell">
                        oi
                    </div>
                    <div className="cell">
                        oi
                    </div>
                    <div className="cell">
                        oi
                    </div>
                    <div className="cell">
                        oi
                    </div>
                </div>
            ))
        }
        console.log("resize")
        console.log(width, arr.length, tot, Math.max(0, tot*40-width))

        $("input[type='range']").attr("max", Math.max(0, tot*40-width))
        $(".cell").css({
            transform: "translate(0px)"
        })
        this.setState({valueRange: 0, cols: arr})
        $(".ui.range").range('set value', 30)
    }

    componentDidMount() {        
        let resizeRange = this.resizeRange;
        $(".ui.menu .item").tab({
            onLoad: function(path) {
                if (path === "Execução") resizeRange();
            }
        });

        $(window).resize(function() {
            resizeRange();
        });

        $(".ui.range").range({
            min: 0,
            max: 30,
            start: 0,
            onChange: (val) => {

            }
        });
    }
    onClickCell() {
        $(".cell").css({
            transition: 'all 0.4s',
            transform: "translate(-40px)"
        })
    }
    render() {
        return (
            <div className="ui grid">
                <div className="column">
                    <div id="box-time">
                        {
                            this.state.cols.map((col, i) => (
                                <div className="cell" onClick={() => this.onClickCell()}>
                                    {i}
                                </div>
                            ))    
                        }
                    </div>
                    <div id="box-execucao">
                        {
                            this.state.cols.map(col => (
                                col
                            ))
                        }
                    </div>
                    <input id="scrollrange" type="range" onChange={(e) => this.onRange(e)} value={this.state.valueRange}/>
                    <div className="ui range"></div>
                    <button className="ui icon button" onClick={() => this.start()}>
                        <i className="play icon"/>
                    </button>
                </div>
            </div>
        )
    }
}

export default Execucao;