var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');
var expressErrorHandler = require('express-error-handler');
var session = require('express-session');
var config = require('./config');
var route_loader = require('./route/route_loader');
var app = express();
app.set('views',__dirname+'/views');
app.set('view engine','ejs');
app.set('port',process.env.PORT || config.server_port);
app.use('/views',express.static(__dirname+"/views"));
app.use(session({
  secret:'asdno12@!@as2',
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : false}));

app.use(bodyParser.json());

app.use('/public',static(path.join(__dirname,'public')));

route_loader.init(app,express.Router());
var errorhandler = expressErrorHandler({
  static:{
    '404' : './public/404.html'
  }
});
app.use(expressErrorHandler.httpError(404));

app.use(errorhandler);


http.createServer(app).listen(app.get('port'),function(){
  console.log('서버가 시작됨 포트 : ' + app.get('port'));
});
