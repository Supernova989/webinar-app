const users = require('./users/users.service.js');
const apiV1Subscriptions = require('./api/v1/subscriptions/subscriptions.service.js');
const apiV1Notifications = require('./api/v1/notifications/notifications.service.js');
const apiV1EmailTokens = require('./api/v1/email-tokens/email-tokens.service.js');
const apiV1Posts = require('./api/v1/posts/posts.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
    app.configure(users);
    app.configure(apiV1Subscriptions);
    app.configure(apiV1Notifications);
    app.configure(apiV1EmailTokens);
    app.configure(apiV1Posts);
};
