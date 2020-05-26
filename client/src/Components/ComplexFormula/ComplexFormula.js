import React, { Component } from 'react';
import './ComplexFormula.css';

class ComplexFormula extends Component {

    constructor(props){
        super(props);
        this.state = { 
            stocks: [],
            selected: [],
            formulaIndex: props.formulaindex,
            result: "Click button to calculate"
         };
         this.onClick = this.onClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            stocks: nextProps.stocks,
            selected: nextProps.selectedStock
        })
    }

    onClick(event){
        var data = {};
        data = (this.state.formulaIndex === "1") ? {"stock": this.state.selected} : {"stocks": this.state.stocks};

        fetch('/api/formulas/' + this.state.formulaIndex,{
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
        return <div className="bigButton rowB">
            <button formulaindex={this.props.FormulaIndex} onClick={this.onClick}>{this.props.Description}</button>
            <label><b>{this.state.result}</b></label>
        </div>
    }

}

export default ComplexFormula