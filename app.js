
/**
 * Module dependencies.
 bodyParser:解析客户端请求,通常是post发生的内容
 methodOverride:支持http定制的方法
 router:项目的路由支持
 static:提供了静态文件支持
 errotHandler错误控制器
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var MongoStore = require('connect-mongo')(express);
var settings = require('./setting');
var flash = require('connect-flash');
var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(flash());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.cookieParser());
  app.use(express.session({
    secret: settings.cookieSecret,
    key: settings.db,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
      db: settings.db
    })
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  routes(app);
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
/*app.use(function(req,res,next){
  var err = req.flash('error');
  res.locals.error = err.length ? err : null;
  var suc = req.flash('success');
  res.locals.success = suc.length ? suc : null;
  res.locals.user = req.session.user;
  next();
})*/

app.locals({
  user: function(req, res) {
    return req.session.user;
  },
  error: function(req, res) {
    var err = req.flash('error');
    if (err.length)
      return err;
    else
      return null;
  },
  success: function(req, res) {
    var succ = req.flash('success');
    if (succ.length)
      return succ;
    else
      return null;
  },
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
