function Trade(timeStamp, quantity, price, transactionType, cash){
    this.TimeStamp = timeStamp;
    this.Quantity = quantity;
    this.Price = price;
    this.Type = transactionType;
    this.Cash = cash;
}

module.exports.Trade = Trade;