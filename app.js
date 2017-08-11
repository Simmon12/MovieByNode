var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();
var index = require('./routes/index');
var fs = require('fs');
var dbUrl = 'mongodb://localhost/imovie';

mongoose.connect(dbUrl)


// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path)



// view engine setup
app.set('views', path.join(__dirname, 'app/views/pages'));
app.set('view engine', 'jade');
app.locals.moment = require('moment')


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// 调试
if('development' === app.get('env')) {
  console.log('process.env.server_ENV: ', process.env.server_ENV)
  console.log('app.get("env")', app.get('env'))
  console.log('in development environment')
  app.set('showStackError', true)
  app.use(logger(':method :url :status'))
  app.locals.pretty = true
  mongoose.set('debug', true)
}

// 重点理解原因
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('connect-multiparty')());

app.use(cookieParser());
app.use(session({
  secret: 'imooc',
  store: new MongoStore({
    url: dbUrl,
    collection: 'sessions'
  }),
  resave: false,
  saveUninitialized: true
}))


// 静态资源的获取
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

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


/* grunt 调整启动服务的脚本，包括package.json的start做了变动*/
var debug = require('debug')('imooc：server'); // debug模块
app.set('port', process.env.PORT || 3000); // 设定监听端口

// Environment sets...

// module.exports = app; 这是 4.x 默认的配置，分离了 app 模块,将它注释即可，上线时可以重新改回来

//启动监听
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
/* grunt */

module.exports = app;
