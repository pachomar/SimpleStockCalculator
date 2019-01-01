var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var moment = require('moment');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var Stock = require('./model/Stock').Stock;
var Trade = require('./model/Trade').Trade;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/api/stocks', function(request, response){
    var stocks = [];
    
    stocks[0] = new Stock("TEA","Common", 0, null, 100);
    stocks[1] = new Stock("POP","Common", 8, null, 100);
    stocks[2] = new Stock("ALE","Common", 23, null, 60);
    stocks[3] = new Stock("GIN","Preferred", 8, 2, 100);
    stocks[4] = new Stock("JOE","Common", 3, null, 250);

    response.send(stocks);
});

app.get('*', indexRouter);

app.post('/api/transaction/', function(request, response){
  var data = request.body;

  var trade = new Trade(data.trade.TimeStamp, data.trade.Quantity, data.trade.Price, data.trade.Type, data.trade.Cash);
  data.stock.Trades.push(trade);

  response.send(data.stock);
});

app.post('/api/calculate/:formulaIndex', function(request, response){
  var result = null; 
  var data = request.body;

    switch(request.params.formulaIndex) {
      //Calculate Dividend Yield
      case "1":
      {
        if(parseFloat(data.inputValue) > 0) {
          if(data.stock.Type === "Common")
              result = "Result: " + (Math.round((data.stock.LastDividend / parseFloat(data.inputValue))*100)/100);
          else
              result = "Result: " + (Math.round((data.stock.FixedDividend * data.stock.ParValue / parseFloat(data.inputValue))*100)/100);
        } 
        else {
          result = "Input must be higher than 0";
        }
        break;
      }
      //Calculate P/E Ratio
      case "2":
      {
        if(data.stock.Type === "Common"){
          if(data.stock.LastDividend != 0)
            result = "Result: " + (Math.round((parseFloat(data.inputValue) / data.stock.LastDividend) *100) / 100);
          else
            result = "Last Dividend must be different from 0";
        }
        else{
          if((data.stock.FixedDividend * data.stock.ParValue) != 0)
            result = "Result: " + (Math.round((parseFloat(data.inputValue) / data.stock.FixedDividend * data.stock.ParValue) *100)/100);
          else
            result = "Fixed Dividend and Par Value must be different from 0";
        }
        break;
      }    
  }

  response.send(JSON.stringify(result));
});

app.post('/api/formulas/:formulaIndex', function(request, response){
  var result = null; 
  var data = request.body;

  switch(request.params.formulaIndex) {
    //Calculate Volume Weighted Stock Price 
    case "1":
    {
        if(data.stock.Trades != null && data.stock.Trades.length > 0)
        {
            result = this.getStockPrice(data.stock);
            if(result > 0)
              result = "Result: $" + result;
            else 
              result = "No trades in last 5 minutes";
        }
        else
         result = "Stock has no trades";
        break;
    }
    //Calculate Geometric Mean
    case "2":
    {
      console.log(data.stocks.length)
       var product = 1;
       for(var x=0; x< data.stocks.length; x++)
       {
          product = product * this.getStockPrice(data.stocks[x]);
       }
       result = "Result: " + (Math.round(Math.pow(product, 1/10)*100)/100);
       break;
    }
  }

  response.send(JSON.stringify(result));
});

//Calculate Volume Weighted Stock Price for a stock
getStockPrice = function (stock){
  var recentTrades = [];
  for(var i=0; i < stock.Trades.length; i++)
  {
    var tradeTime = moment(stock.Trades[i].TimeStamp, 'MM/DD/YYYY HH:mm:ss');
    var minutesPassed = moment().diff(tradeTime, 'minutes');
    if(minutesPassed <= 5)
      recentTrades.push(stock.Trades[i]);
  }

  if(recentTrades != null && recentTrades.length > 0)
  {
    var sumCash = 0; var sumQuantity = 0;
    for(var x=0; x < recentTrades.length; x++){
      sumCash += parseFloat(recentTrades[x].Price) * parseFloat(recentTrades[x].Quantity);
      sumQuantity += parseFloat(recentTrades[x].Quantity);
    }
    result = (Math.round((sumCash / sumQuantity) *100)/ 100);
  }
  else
    result = 0;

  return result;
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
