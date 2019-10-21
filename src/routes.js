const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('home', {title: 'Home'});
});

router.get('/about', (req, res) => {
	res.render('about', {title: 'About'});
});

router.get('/app', (req, res) => {
	res.render('app', {title: 'Webinar'});
});

router.get('/contacts', (req, res) => {
	res.render('contacts', {title: 'Contacts'});
});

router.get('/faq', (req, res) => {
	res.render('faq', {title: 'FAQ'});
});

router.get('/terms', (req, res) => {
	res.render('terms', {title: 'Terms and Conditions'});
});


module.exports = router;
