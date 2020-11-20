var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var processRouter = require('./routes/process');
var reservationRouter = require('./routes/reservation');

var app = express(); //express 사용하여 app 만들기

// view engine setup - ejs 사용
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //쿠키와 세션을 미들웨어로 등록한다
app.use(express.static(path.join(__dirname, 'public')));


var expressSession = require('express-session');
//세션 환경 세팅
//세션은 서버쪽에 저장하는 것을 말하는데, 파일로 저장 할 수도 있고 레디스라고 하는 메모리DB등 다양한 저장소에 저장 할 수가 있는데
app.use(expressSession({
    secret: 'my key',   //이때의 옵션은 세션에 세이브 정보를 저장할때 할때 파일을 만들꺼냐 , 아니면 미리 만들어 놓을꺼냐 등에 대한 옵션들임
    resave: true,
    saveUninitialized: true

}));



var bodyParser_post = require('body-parser');       //post 방식 파서
//post 방식 일경우 begin
//post 의 방식은 url 에 추가하는 방식이 아니고 body 라는 곳에 추가하여 전송하는 방식
app.use(bodyParser_post.urlencoded({ extended: false }));            // post 방식 세팅
app.use(bodyParser_post.json());                                     // json 사용 하는 경우의 세팅


/*var fs = require('fs');
var locker = fs.readFileSync(__dirname+'/public/locker.json')
var lockerJSON = JSON.parse(locker);
console.log(lockerJSON.seats);
*/


//app 라우팅 하기
app.use('/', indexRouter);
app.use('/process', processRouter);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

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
