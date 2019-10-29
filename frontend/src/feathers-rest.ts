import rest from '@feathersjs/rest-client';
import feathers from '@feathersjs/feathers';
import axios from 'axios';

const app = feathers();
const restClient = rest(process.env.REACT_APP_HOST!);
app.configure(restClient.axios(axios));

export type ServiceNames = 'blog' | 'users';
export type AuthenticationStrategies = 'local' | 'jwt';

export function getService(name: ServiceNames, version: Number = 1) {
	return app.service(`/api/v${version}/${name}`);
}

export function apiAuthentication(email: string, password: string, strategy: AuthenticationStrategies = 'local') {
	const c = {
		email, password, strategy
	};
	return app.service('/authentication').create(c)
}


