import React, { Component } from 'react';
import './ParentComponent.css';
import StockSelector from '../StockSelector/StockSelector';
import ButtonFormula from '../ButtonFormula/ButtonFomula';
import TradeSimulator from '../TradeSimulator/TradeSimulator';
import TradeGrid from '../TradeGrid/TradeGrid';
import ComplexFormula from '../ComplexFormula/ComplexFormula';

class ParentComponent extends Component {
    
    constructor(){
        super();
        this.state = { 
            stocks: [],
            selected: [],
            formulaIndex: 0
         };
    }

    componentDidMount(){
        this.fetchOptions();
    }

    fetchOptions(){
        fetch('/api/stocks',{})
        .then((res) => {
            return res.json();
        }).then((json) => {
            this.setState({stocks: json});
            this.setState({selected: this.state.stocks[0] });
        })
        .catch((error) => {
            console.log(error);
            throw new Error('Failed to load stocks');
        });
    }

    selectedStockChanged = (stock) => {
        var index = this.state.stocks.findIndex(obj => obj.Symbol===stock.Symbol);
        var stocksUpdated = this.state.stocks;
        stocksUpdated[index] = stock;

        this.setState({stocks: stocksUpdated});
        this.setState({selected: stock});
    }

    render() {
        return (<div>
                <div className='rowD'>
                    <StockSelector stocks={this.state.stocks} onSelectedItemChange={this.selectedStockChanged} defaultselection={this.state.selected}></StockSelector><br/>
                    <div>
                        <ButtonFormula formulaindex="1" calcResult={this.state.result} Description="Dividend Yield" selectedStock={this.state.selected}></ButtonFormula>
                        <ButtonFormula formulaindex="2" Description="P/E Ratio" selectedStock={this.state.selected}></ButtonFormula>
                    </div>
                </div>
                <div className='rowD'>
                    <TradeSimulator selectedStock={this.state.selected} onSelectedItemChange={this.selectedStockChanged}></TradeSimulator>
                    <div>
                        <ComplexFormula formulaindex="1" Description="Volume Weighted Stock Price" stocks={this.state.stocks} selectedStock={this.state.selected}></ComplexFormula>
                        <ComplexFormula formulaindex="2" Description="GBCE All Share Index" stocks={this.state.stocks} selectedStock={this.state.selected}></ComplexFormula>
                    </div>    
                </div>
                <h5>Transaction History</h5>
                <TradeGrid data={this.state.selected}></TradeGrid>
            </div>
        )}
}



export default ParentComponent;
