var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const userRouter = require('./routes/userRouter');
const categoryRouter = require('./routes/categoryRouter');
const orchidRouter = require('./routes/orchidRouter');
const accountRouter = require('./routes/accountRouter');

var app = express();

const url = "mongodb://127.0.0.1:27017/SDN_Ass3";
const connect = mongoose.connect(url)
connect.then((db)=>{
  console.log("Connected to the Database");
}).catch((err)=>{
  console.log(err);
})

require('./config/passport')(passport);

app.use(
  session({
    secret: 'secret2',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.loggedIn = req.session.loggedIn;
  res.locals.user = req.user || null;
  //General message
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  //Change password message
  res.locals.successPassword_msg = req.flash('successPassword_msg');
  res.locals.errorPassword_msg = req.flash('errorPassword_msg');
  res.locals.errorPassword = req.flash('errorPassword');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);
app.use('/categories', categoryRouter);
app.use('/orchids', orchidRouter);
app.use('/accounts', accountRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
