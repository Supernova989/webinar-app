const logger = require('./logger');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p, ...rest) => {
	logger.error('Unhandled Rejection at: Promise ', p, reason, rest)
});

server.on('listening', () => {
	logger.info(`Feathers application started on ${app.get('host')}:${port}`);
	app.service('api/v1/zoom').fetchMeetings();
});

