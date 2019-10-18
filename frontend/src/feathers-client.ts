import rest from '@feathersjs/rest-client';
import feathers from '@feathersjs/feathers';

const app = feathers();
const restClient = rest(process.env.REACT_APP_HOST);
app.configure(restClient.fetch(window.fetch));

export type ServiceNames = 'blog' | 'users';

export function getService(name: ServiceNames, version: Number = 1) {
	return app.service(`api/v${version}/${name}`);
}


