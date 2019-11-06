const fetch = require('node-fetch');

module.exports = (options = {}) => {
	return async context => {
		const url = 'https://www.google.com/recaptcha/api/siteverify';
		const result = fetch(url, {
			method: 'post',
			body: {
				secret: context.app.get('googleReCaptcha').secret,
				response: '',
			},
		}).json();
		console.log('Captcha result:', result);
		return context;
	};
};
