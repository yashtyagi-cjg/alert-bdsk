var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config()

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

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

async function main(){
  await mongoose.connect(process.env.MONGODB_URI, 
    {
      dbName: process.env.MONGODB_NAME
  })

  console.log('Connected to MongoDB @  ', process.env.MONGODB_NAME);
}


const {scheduleNotifications, reloadAndRescheduleJobs} = require('./schedulers/messageSchedule');
main().then(()=>{

    reloadAndRescheduleJobs()

    // Example appointment
    const appointment = {
      id: 11,
      date: new Date(Date.now()),
      phoneNumber : 'PutNumber',
      message: 'Chal ok', 
    };

  // scheduleNotifications(appointment); //Uncomment to Test
}).catch((err)=>{
  console.log(`Encountered error while connecting to DB ${process.env.MONGODB_NAME}`)
  console.log(err)
})


module.exports = app;
