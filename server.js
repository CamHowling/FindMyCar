let express = require("express");
let app = express();

//var app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);


var port = process.env.PORT || 5000;

//Launch using directory
app.use(express.static(__dirname + '/assets'));

app.get("/test", function (request, response) {
  var user_name = request.query.user_name; //this query may not work
  response.end("Hello " + user_name + "!"); //this probably not super useful
});



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
//needs to add some element of mySQL

/*

//create mysql instance on server
//needs replacement/user input for username/password and possibly host?

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "yourusername",
    password: "your password"
});

con.connect(function(err)){
    if(err) throw err;
    console.log("Connected!");

    //not sure if this needs to be inside the con.connect to function
    con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);

  });

}

*/