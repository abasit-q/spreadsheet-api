var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongooose = require('mongoose');

var config = require('./config');

var userSchema = require('./models/user');
var sheetSchema = require('./models/spreadsheet');

var index = require('./routes/index');
var auth = require('./routes/auth');
var signup = require('./routes/signup');
var users = require('./routes/users');
var spreadSheet = require('./routes/spreadsheet');
var columns = require('./routes/columns');
var rows = require('./routes/rows');
var cells = require('./routes/cells');
var authMiddleware = require('./routes/middlewares/authMiddleware');

var app = express();
app.use('/', express.static(__dirname + '/'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', index);
app.use('/login', auth);
app.use('/signup', signup);
app.use('/auth', authMiddleware);
app.use('/auth/users', users);
app.use('/auth/spreadsheet', spreadSheet);
app.use('/auth/columns', columns);
app.use('/auth/rows', rows);
app.use('/auth/cells', cells);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
