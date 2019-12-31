var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jsonfile = require('jsonfile');
var filiePath = "./data/cities.json";
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mongoose = require('mongoose');
var stateModel = require('./models/states')
mongoose.connect('mongodb://localhost:27017/attainu', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err) {
  console.log(err, "connecting mongo db-=---------")
})
var app = express();

app.get('/states', function (req, res) {
  var query = {};
  var select = {state:1, _id: 0};
  if(req.query.hasOwnProperty('search') && req.query.search){
    query = { state: new RegExp(req.query.search, 'i') };
  }
  stateModel.find(query, function (err, results) {
    if (err) {
      res.send({ success: false, error: "Error fetching states" });
    } else {
      if (results.length <= 0) {
        res.send({ success: true, data: results, message: 'No States found. Please check the state name' });
      } else {
        res.send({ success: true, data: results });
      }
    }
  })
})

app.get('/cities', function (req, res) {
  var query = {};
  var select = {cities:1, _id: 0, state: 1};
  if(req.query.hasOwnProperty('search') && req.query.search){
    query = { cities: new RegExp(req.query.search, 'i') };
    select = {state: 1, 'cities.$':1, _id: 0};
  }
  stateModel.find(query, select, function (err, results) {
      if (err) {
        res.send({ success: false, error: "Error fetching states" });
      } else {
        if (results.length <= 0) {
          res.send({ success: true, data: results, message: 'No Cities found. Please check the state name' });
        } else {
          res.send({ success: true, data: results });
        }
      }
    })
})

app.get('/seed', function (req, res) {
  jsonfile.readFile(filiePath).then(function (data) {
    var states = {};
    var dataArray = [];
    for (var i = 0; i <= data.length - 1; i++) {
      if (data[i].state) {
        if (!states.hasOwnProperty(data[i].state)) {
          states[data[i].state] = data.filter(obj => {
            return obj.state === data[i].state
          }).map((obj) => {
            return obj.name;
          })
          var stateModelSchema = new stateModel({ state: data[i].state, cities: states[data[i].state] });
          var error = stateModelSchema.validateSync();
          if (!error) {
            stateModelSchema.save();
            dataArray.push(stateModelSchema);
          }
        }
      }
    }
    res.send({ success: true, data: dataArray });
  });

})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;