//this is the api server that connects to your database
//you want it to process json requests and return json responses

//add requires as needed
//you will want that body parse thing

const express = require('express');
const app = express();

app.arguments(express.static(_dirname));

const bodyParser = require('body-parser');
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));

const passport = require('passport');

//Passport elements
app.use(passport.initialize());
app.use(passport.session());

//Ordinarily a bunch of mongoose stuff goes in here, need to replace wiht MYSQL

passport.use(UserDetails.createStrategy());
passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());

//w3s

let con = mysql.createConnection( {
    host: "localhost",
    user: "yourusername",
    password: "yourpassword"
});

con.connect (function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Resulte: " + result)
    })
})

/* Routes */

const connectEnsureLogin = require('connect-ensure-login');

app.get('/car-space/:id', function (req, res) {
    //read json from req store in variable called user
    //user = db.get(req.body)
    //handle errors and send as respose if error occurs
    //marshal user to json and send as res body
});

app.get('/car-space', function (req, res) {
    //read json from req store in variable called user
    //user = db.get(req.body)
    //handle errors and send as respose if error occurs
    //marshal user to json and send as res body
});

app.post('/user', function (req, res) {
    //read json from req store in variable called user
    //user = db.get(req.body) => pseudocode, this wont actually work lol
    //handle errors and send as respose if error occurs
    //marshal user to json and send as res body
});

app.delete('/user/:id', function (req, res) {
    //read json from req store in variable called user
    //user = db.getUser(req.params['id']) => pseudocode, this wont actually work lol
    //handle errors and send as respose if error occurs
    //marshal user to json and send as res body

});

app.get('/user/:id', function (req, res) {

});

app.get('/user', function (req, res) {

});

app.put('/user/:id', function (req, res) {

});
