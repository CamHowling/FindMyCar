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
	secret: 'vidyapathaisalwaysrunning', //rename?
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


/*
//express and pug stuff
app.set('view engine', 'pug');
app.set('views', './views');
app.get('/carspace/:id', retrieveCarSpace);
app.get('/carspace', retrieveCarSpaces);

//fetch requests http will need modification


app.post('/user', function (req, res) {
  fetch('http://api-server-hostname:api-server-port/user', {
      method: 'POST',
      body: req.body,
  }).json(json => {
      res.render('/user/user.pug', json)
  }).error(error => {
      res.render('/error/error.pug', { error: error })
  });
})

app.get('/user/:id-:firstname', function (req, res) {
  fetch('http://api-server-hostname:api-server-port/user/' + req.params['id'], {
      method: 'GET',
      body: user,
  }).json(json => {
      res.render('/user/user.pug', json)
  }).error(error => {
      res.render('/error/error.pug', { error: error })
  })
})
*/

/*
//socket test
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  setInterval(()=>{
    socket.emit('number', parseInt(Math.random()*10));
  }, 1000);

});
*/

//this is only needed for Cloud foundry 
//require("cf-deployment-tracker-client").track();


//notes about this file
//basic server express node.js file, some pieces may not be needed
