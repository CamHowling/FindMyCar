//Server

//Tools to include/use
//---------------------------------------------
let express = require("express");
let session = require("express-session");
let cookieParser = require('cookie-parser');
let morgan = require('morgan');
let app = express();
var port = process.env.PORT || 5000;

let passport = require('passport');
let flash = require('connect-flash'); //may need to scrap
const bodyParser = require("body-parser");

let http = require('http').createServer(app);
let io = require('socket.io')(http);
//---------------------------------------------
//Database stuff

require('./database/config/passport')(passport); //passport handles config

//setting up express app
app.use(morgan('dev'));  //logs requests to console, can probable scrap
app.use(cookieParser()); //read cookies for auth
app.use(bodyParser.urlencoded({
  embedded: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); //ejs for templates - may replace with pug templates

//Launch using directory
//app.use(express.static(__dirname + '/assets')); //need to re-establish after SQL template used

app.use(session({
	secret: 'findmycar', //rename?
	resave: true,
	saveUninitialized: true
})); // session secret?

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//testing directory.. not sure what to do with it yet
app.get("/test", function (request, response) {
  var user_name = request.query.user_name; 
  response.end("Hello " + user_name + "!");
});

// Routes ---------------------------------------------

require('./database/dbroutes.js')(app, passport); //load routes and pass in app with configured passport -  may need to alter directory

// Launch ---------------------------------------------

http.listen(port,()=>{
  console.log("Listening on port ", port);
});
