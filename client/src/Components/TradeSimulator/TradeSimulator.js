import React, { Component } from 'react';
import './TradeSimulator.css';
import moment from 'moment';

class TradeSimulator extends Component {

    constructor(){
        super();
        this.state = { 
            selected: [],
            quantity: 0,
            price: 0,
            message: "Choose Transaction Type"
        };
        this.onChange = this.onChange.bind(this);
        this.buyTrade = this.buyTrade.bind(this);
        this.sellTrade = this.sellTrade.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: nextProps.selectedStock
        })
    }

    onChange(event){
        const re = /^\d+(\.\d{1,2})?$/;
        if (event.target.value === '' || re.test(event.target.value)) {
           if(event.target.id === "price")
                this.setState({price: event.target.value});
            else
                this.setState({quantity: event.target.value});
        }
    }

    buyTrade(event){
        this.createTradeRecord("B");
    }

    sellTrade(event){
        this.createTradeRecord("S");
    }

    createTradeRecord(transactionType){
        if(this.state.price === 0 || this.state.quantity === 0){
            this.setState({message: "Values must be over 0"})
        }
        else{
            var date = moment(new Date()).format('MM/DD/YYYY HH:mm:ss');
            var data = {"stock": this.state.selected, "trade" : {"TimeStamp":date,"Quantity":this.state.quantity,"Price":this.state.price,"Type":transactionType,"Cash":'$'+(this.state.quantity * this.state.price)}};

            fetch('/api/transaction/',{
                method: 'POST',
                body: JSON.stringify(data),
                headers: {"Content-Type": "application/json"}
            })
            .then((response) => {
                response.json().then((result)=> {
                this.setState({ selected: result });
                this.setState({ message: "Trade completed successfully"})
                this.props.onSelectedItemChange(this.state.selected);
                })
            })
            .catch((error) => {
                console.log(error);
                this.setState({ message: "Transaction failed" })
            });
        }
    }

    render(){
        return <div>
            <div className="TradeContainer">
                <h5>Make a Trade</h5>
                <div className="rowA">
                    <label><b>Quantity</b></label>
                    <input type="number" id="quantity" onChange={this.onChange} value={this.state.quantity}></input>
                    <button onClick={this.buyTrade}>Buy!</button>
                </div>
                <div className="rowA">
                    <label><b>Price</b></label>
                    <input type="number" id="price" onChange={this.onChange} value={this.state.price}></input>
                    <button onClick={this.sellTrade}>Sell!</button>
                </div>
                <label>{this.state.message}</label>
            </div>
        </div>
    }
}

export default TradeSimulator