// config/passport.js


var LocalStrategy   = require('passport-local').Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

// expose this function to our app using module.exports
module.exports = function(passport) {

    // passport session setup ==================================================

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

    // LOCAL SIGNUP ============================================================

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and user_password, we will override with email
            usernameField : 'username',
            passwordField : 'user_password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, user_password, done) {
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
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
                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.user_password],function(err, rows) {
                        if(err){
                            console.log(err);
                            return done(null, err);
                        }
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // LOCAL LOGIN =============================================================

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'user_password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, user_password, done) { 
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }
                // if the user is found but the user_password is wrong
                if (!bcrypt.compareSync(user_password, rows[0].user_password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                return done(null, rows[0]);
            });
        })
    );
};
