let express = require("express");
let app = express();

//var app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);


var port = process.env.PORT || 5000;

//Launch using directory
app.use(express.static(__dirname + '/assets'));

//testing directory.. not sure what to do with it yet
app.get("/test", function (request, response) {
  var user_name = request.query.user_name; 
  response.end("Hello " + user_name + "!");
});

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


http.listen(port,()=>{
  console.log("Listening on port ", port);
});

//this is only needed for Cloud foundry 
require("cf-deployment-tracker-client").track();


//notes about this file
//basic server express node.js file, some pieces may not be needed
