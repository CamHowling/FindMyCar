// database/dbroutes.js
const flash = require("express-flash");

var mysql = require('mysql');
var dbconfig = require('./config/database.js');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);


module.exports = function(app, passport) {

	// HOME PAGE (with login links) ========

	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});


	// LOGIN ===============================

	// show the login form
	app.get('/login', function(req, res) {
		res.render('user/login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });
	

	// SIGNUP ==============================
	// show the signup form
	app.get('/signup', function(req, res) {
		res.render('user/signup.ejs', { message: req.flash('signupMessage') });	
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', 
		failureRedirect : '/signup', 
		failureFlash : true 
	}));


	// PROFILE SECTION =========================

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('user/profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// process the signup form
	app.post('/profile', isLoggedIn, function(req, res) {
		connection.query("UPDATE users SET carlocation = ? WHERE id = ?",[req.body.carlocation, req.user.id], function(err, rows) {
			if (err)
				return done(err);
		});
		let user=req.user;
		connection.query("SELECT * FROM users WHERE id = ?",[req.user.id], function(err, rows) {
			if (err)
				return done(err);
			if (rows.length>0)
				user = rows[0];
			else
				return done(Error("User not found"));
		})
		res.render('user/profile.ejs', {
			user : user // get the user out of session and pass to template
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	// ERROR ===============================

	app.get('/error', function(req, res){
		console.log(req.flash('error'));
		res.send();		
	});

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
