import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { css, jsx } from '@emotion/core';
import Loadable from "react-loadable";
import SecureRoute from './components/secure-route';
import GridLoader from 'react-spinners/GridLoader';
// import ws from './feathers-socket';
import ForbiddenPage from "./pages/forbidden-page";
import { connect } from 'react-redux';

const LoginPage = Loadable({
	loader: () => import('./pages/login-page'),
	loading: PageLoaderSpinner,
	delay: 300,
});

const RegisterPage = Loadable({
	loader: () => import('./pages/register-page'),
	loading: PageLoaderSpinner,
	delay: 300,
});

const AccountPage = Loadable({
	loader: () => import('./pages/account-page'),
	loading: PageLoaderSpinner,
	delay: 300,
});

const BlogPage = Loadable({
	loader: () => import('./pages/blog-page'),
	loading: PageLoaderSpinner,
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

export function PageLoaderSpinner(props) {
	const {error, pastDelay} = props;
	if (error) {
		return <div>Error! <button onClick={props.retry}>Retry</button></div>;
	} else if (pastDelay) {
		return <GridLoader css={css`display: block;`}
						   sizeUnit={"px"}
						   color={'#6c757d'}
						   loading={true}/>;
	}
	return null;
}

function mapStateToProps(state) {
	return {
		auth: state.auth
	};
}

export default connect(mapStateToProps)(App);
