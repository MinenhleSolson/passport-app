var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');

// User model
var User = require('../models/User')

//login page
router.get('/login', (req, res) => res.render('login'))

//Register page
router.get('/register', (req, res) => res.render('register'))

//register handle. creating empty array push errors if they occur
router.post('/register', (req, res) => {
    var { name, email, password, password2 } = req.body;
    let errors = []

    //check if all fields a field
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'please fill in all fields'});
    }

    // checking if passwords match
    if(password !== password2 ) {
        errors.push({ msg: 'passwords dont match'})
    }
    
    //checking if password is 6 characters and up
    if(password.length < 6){
        errors.push({ msg: 'password should be at least 6 characters'})
    }
     
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
       //validation pass
        User.findOne({ email: email})
        .then(user => {
            if(user) {
                //user already exists
                errors.push({ msg: 'User already exists'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else{
                var newUser = new User({
                    name,
                    email,
                    password
                });

                //hash password
                bcrypt.genSalt(10, (err, salt) =>bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    //set password to hash
                    newUser.password = hash
                    // save user and redirect to login
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'You are now registered');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                }));
            }
        });
    }

});

//login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')
});

module.exports = router