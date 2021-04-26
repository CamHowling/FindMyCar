// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        //connection.connect();
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
        //connection.end();
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and user_password, we will override with email
            usernameField : 'username',
            passwordField : 'user_password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, user_password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            //connection.connect();
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    //console.log(err);
                    return done(err);
                if (rows.length) {
                    //console.log("That username is already taken.");
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        user_password: bcrypt.hashSync(user_password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( username, user_password ) VALUES (?,?)";
                    //connection.connect();
                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.user_password],function(err, rows) {
                        if(err){
                            console.log(err);
                            return done(null, err);
                        }
                        newUserMysql.id = rows.insertId;
                        //console.log("Successfully joined.");
                        return done(null, newUserMysql);
                    });
                    //connection.end();
                }
            });
            //connection.end();
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and user_password, we will override with email
            usernameField : 'username',
            passwordField : 'user_password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, user_password, done) { // callback with email and user_password from our form
            //connection.connect();
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    //console.log(err);
                    return done(err);
                if (!rows.length) {
                    //console.log("loginMessage', 'No user found.");
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the user_password is wrong
                if (!bcrypt.compareSync(user_password, rows[0].user_password))
                    //console.log("loginMessage', 'Oops! Wrong password.");
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                //console.log("Logged in successfully");
                return done(null, rows[0]);
            });
            //connection.end();
        })
    );
};
