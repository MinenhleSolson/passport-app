var express = require('express')
var router = express.Router();
var { ensureAuthenticated } = require('../config/auth')

//home page
router.get('/', (req, res) => res.render('welcome'))
//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => 
res.render('dashboard', {
    name: req.user.name
}));


module.exports = router