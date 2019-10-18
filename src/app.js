const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');
const routes = require('../routes/routes');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');


const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const authentication = require('./authentication');

const sequelize = require('./sequelize');

const app = express(feathers());

app.set('views', [path.join(__dirname, '..', 'views'), path.join(__dirname, '..', 'frontend', 'build')]);
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.set('view options', { layout: 'index' });

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

// Host the public folder
app.use('/', routes);
app.use('/', express.static(app.get('public')));

app.use('/app/:addr', (req, res) => {
	console.log(req.params.addr);
	res.redirect(`/app#${req.params.addr}`);
});

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(sequelize);

// Configure other middleware (see `middleware/index.jsx`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.jsx`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({logger}));

app.hooks(appHooks);

module.exports = app;
