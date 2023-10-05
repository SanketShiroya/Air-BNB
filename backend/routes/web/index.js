// Imports
var express = require('express');
// const router = require('./payments');
var router = express.Router();

/**
 * Home page
 * 
 */
router.get('/', function(req, res, next) {
	res.render('pages/index', { 
		title: 'Donate for Animals'
	});
});

module.exports = router;