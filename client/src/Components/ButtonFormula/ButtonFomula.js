import React, { Component } from 'react';
import './ButtonFormula.css';

class ButtonFormula extends Component {
    
    constructor(props){
        super(props);
        this.state = { 
            formulaIndex: props.formulaindex,
            inputValue: 0,
            selected: [],
            result: null
        };
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: nextProps.selectedStock
        })
    }

    onChange(event){
        const re = /^\d+(\.\d{1,2})?$/;
        if (event.target.value === '' || re.test(event.target.value)) {
           this.setState({value: event.target.value})
           this.setState({inputValue: event.target.value});
        }
    }

    onClick(event){
        var data = {"inputValue": this.state.inputValue, "stock" : this.state.selected};

        fetch('/api/calculate/' + this.state.formulaIndex,{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"}
        })
        .then((response) => {
            response.json().then((result)=> {
            this.setState({ result: result })})
        })
        .catch((error) => {
            console.log(error);
            this.setState({ result: "Error on the calculation" })
        });
    }

    render(){
        return <div>
            <div className="contentWrapper">
            <button formulaindex={this.props.FormulaIndex} onClick={this.onClick}>{this.props.Description}</button>
            <input type="number" onChange={this.onChange} value={this.state.inputValue}></input>
        </div>
        <label><b>{this.state.result?this.state.result:'Click to calculate'}</b></label>
        </div>
    }
}

export default ButtonFormula;