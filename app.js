require("dotenv").config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const MongoStore = require('connect-mongo')
var indexRouter = require('./routes/index');
const mongoose=require("mongoose")
mongoose.set("strictQuery", false)


var app = express();


// Session management
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create a connection to MongoDB
mongoose.connect(process.env.DATABASEURL, dbOptions, (err) => {
  if (!err) {
    console.log('Successful connection');
  } else {
    console.error('Connection error:', err);
  }
});

// Create a MongoStore instance
const sessionStore = MongoStore.create({
  mongoUrl: process.env.DATABASEURL, // Use the same connection URL
  collectionName: 'sessions', // Specify the collection name
  autoRemove: 'native' 
});



app.use(session({
    store:sessionStore,
    secret: 'cats',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000*60*60*12, 
      path: '/', // Cookie is valid across the entire domain
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Helps prevent JavaScript access
      sameSite: 'lax' // Adjust based on your CSRF protection needs
    }
  }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/",indexRouter)

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
