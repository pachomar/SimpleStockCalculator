import React, { Component } from 'react';
import './StockSelector.css';
import $ from 'jquery'; 

class StockSelector extends Component {

    constructor(){
        super();
        this.state = { 
            options: [],
            selected: []
         };
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            options: nextProps.stocks,
            selected: nextProps.defaultselection
        })
    }

    onChange(event) {
        var selectedOption = $.grep(this.state.options, function(item) { return item.Symbol === event.target.value })[0];
        this.setState({ selected: selectedOption});
        this.props.onSelectedItemChange(selectedOption);
    }

    render(){
        return <div>
            <div className="StockSelector">
            <div className="rowC"><h5>Stock</h5>
            <select className="StockSelector" onChange={this.onChange}>
                { this.state.options? this.state.options.map((stock) => {return <option value={stock.Symbol} key={stock.Symbol}>{stock.Symbol}</option>}):''}
            </select>
            </div>
            <br/>
            <div className="col-sm-12 detail"><b>Type:</b> {this.state.selected.Type}</div>
            <div className="col-sm-12 detail"><b>Last Dividend:</b> {this.state.selected.LastDividend}</div>
            <div className="col-sm-12 detail"><b>Fixed Dividend:</b> {this.state.selected.FixedDividend?this.state.selected.FixedDividend+'%':'-'}</div>
            <div className="col-sm-12 detail"><b>Par Value:</b> {this.state.selected.ParValue}</div>
            <div className="col-sm-12 detail"><b>Trades:</b> {this.state.selected.Trades?this.state.selected.Trades.length:0}</div>
            </div>
        </div>;
    }
}

export default StockSelector;