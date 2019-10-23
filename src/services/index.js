const users = require('./users/users.service.js');
const apiV1Subscriptions = require('./api/v1/subscriptions/subscriptions.service.js');
const apiV1Notifications = require('./api/v1/notifications/notifications.service.js');
const apiV1EmailTokens = require('./api/v1/email-tokens/email-tokens.service.js');
const apiV1Posts = require('./api/v1/posts/posts.service.js');
const apiV1Stripe = require('./api/v1/stripe/stripe.service.js');
const apiV1Zoom = require('./api/v1/zoom/zoom.service.js').service;
const apiV1ZoomMeetings = require('./api/v1/zoom-meetings/zoom-meetings.service.js');

module.exports = function (app) {
	app.configure(users);
	app.configure(apiV1ZoomMeetings);
	app.configure(apiV1Zoom);
	app.configure(apiV1Subscriptions);
	app.configure(apiV1Notifications);
	app.configure(apiV1EmailTokens);
	app.configure(apiV1Posts);
	app.configure(apiV1Stripe);
	
	// app.service('/api/v1/zoom').get('meetings').then(res => {
	// 	app.configure(apiV1ZoomMeetings);
	// });
};
