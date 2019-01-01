function Stock(symbol, type, lastDividend, fixedDividend, parValue){
    this.Symbol = symbol;
    this.Type = type;
    this.LastDividend = lastDividend;
    this.FixedDividend = fixedDividend;
    this.ParValue = parValue;
    this.Trades = [];
}

module.exports.Stock = Stock;