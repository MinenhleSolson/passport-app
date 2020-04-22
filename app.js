var express = require('express');
var path = require('path')
var expressLayouts = require('express-ejs-layouts')
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session')
var passport = require('passport')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
require('./config/passport')(passport)

//db config
var db = require('./config/keys').MongoURI;

//connecting to mongo
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('connected to database...'))
.catch(err => console.log(err));

// view engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');

//body-parser
app.use(express.urlencoded({extended: false}));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variables
app.use((req, res, next) => {
    app.locals.success_msg = req.flash('success_msg');
    app.locals.error_msg = req.flash('error_msg');
    app.locals.error = req.flash('error');
    next();
})


//routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//listening to port
var PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));

module.exports = app;
