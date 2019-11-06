import React, { useEffect, useRef } from 'react';
import { Switch, Route } from 'react-router';
import { css, jsx } from '@emotion/core';
import Loadable from "react-loadable";
import SecureRoute from './components/secure-route';
// import ws from './feathers-socket';
import ForbiddenPage from "./pages/forbidden-page";
import { connect } from 'react-redux';
import { LoaderSpinner } from "./components/loader-spinner";


const LoginPage = Loadable({
	loader: () => import('./pages/login-page'),
	loading: LoaderSpinner,
	delay: 300,
});

const RegisterPage = Loadable({
	loader: () => import('./pages/register-page'),
	loading: LoaderSpinner,
	delay: 300,
});

const AccountPage = Loadable({
	loader: () => import('./pages/account-page'),
	loading: LoaderSpinner,
	delay: 300,
});

const BlogPage = Loadable({
	loader: () => import('./pages/blog-page'),
	loading: LoaderSpinner,
	delay: 300,
});


function App({auth}) {

	// ws.emit('create', 'authentication', {
	// 	strategy: 'local',
	// 	email: 'max@max.com',
	// 	password: '12345'
	// }, function (error, authResult) {
	// 	console.log('!!!!!!!', authResult.accessToken);
	// 	alert();
	// 	console.log(authResult);
	//
	// 	// authResult will be {"accessToken": "your token", "user": user }
	// 	// You can now send authenticated messages to the server
	// });
	//
	// ws.on('connect', () => {
	//
	// 	console.log('connected!');
	// 	ws.emit('create', 'authentication', {
	// 		strategy: 'jwt',
	// 		accessToken: auth.token
	// 	}, function (error, newAuthResult) {
	// 		console.log(newAuthResult);
	// 	});
	// });
	// ws.service('api/v1/zoom-meetings').on('created', message => console.log('New message created', message));
	// ws.service('api/v1/zoom-meetings').on('updated', message => console.log('New message updated', message));
	// ws.service('api/v1/zoom-meetings').on('patched', message => console.log('New message patched', message));
	// ws.service('api/v1/notifications').create({
	// 	text: 'A message from a REST client'
	// });
	

	return (
		<div className="container mt-4 inner-container">
			<Switch>
				<Route path='/login' component={LoginPage}/>
				<Route path='/register' component={RegisterPage}/>
				<Route path='/blog' exact component={BlogPage}/>
				<Route path='/forbidden' exact component={ForbiddenPage}/>
				<SecureRoute path='/account' component={AccountPage}/>
			</Switch>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		auth: state.auth
	};
}

export default connect(mapStateToProps)(App);
