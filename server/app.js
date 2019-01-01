var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var stocks = require('./data.json');

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
    response.send(stocks);
});

app.get('*', indexRouter);

app.post('/api/calculate/:formulaIndex', function(request, response){
  console.log(request.body)
  var result = null; 
  var data = request.body;

    switch(request.params.formulaIndex) {
      //Calculate Dividend Yield
      case "1":
      {
        if(parseFloat(data.inputValue) > 0) {
          if(data.stock.Type === "Common")
              result = "Result: " + (data.stock.LastDividend / parseFloat(data.inputValue));
          else
              result = "Result: " + (data.stock.FixedDividend * data.stock.ParValue / parseFloat(data.inputValue));
        } 
        else {
          result = "Input must be higher than 0";
        }
        break;
      }
      case "2":
      {
        if(data.stock.Type === "Common"){
          if(data.stock.LastDividend != 0)
            result = "Result: " + (parseFloat(data.inputValue) / data.stock.LastDividend);
          else
            result = "Last Dividend must be different from 0";
        }
        else{
          if((data.stock.FixedDividend * data.stock.ParValue) != 0)
            result = "Result: " + (parseFloat(data.inputValue) / data.stock.FixedDividend * data.stock.ParValue);
          else
            result = "Fixed Dividend and Par Value must be different from 0";
        }
      }    
  }

  response.send(JSON.stringify(result));
});

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
