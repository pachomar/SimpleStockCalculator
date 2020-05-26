import React, { Component } from 'react';
import JsonTable  from 'ts-react-json-table';
import './TableGrid.css';

var columns = ['TimeStamp', 'Price', 'Quantity', 'Type', 'Cash'];

class TradeGrid extends Component {

    constructor(props){
        super(props);
        this.state = { 
            selected:[],
            trades: []
         };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({trades: nextProps.data? nextProps.data.Trades:[]});
        this.setState({selected: nextProps.data});
    }

    render(){
        return <div className="gridContainer">
            <JsonTable rows={this.state.trades} columns={ columns }></JsonTable>
        </div>
    }
}

export default TradeGrid