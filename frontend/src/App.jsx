import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { css, jsx } from '@emotion/core';
import Loadable from "react-loadable";
import SecureRoute from './components/secure-route';
import GridLoader from 'react-spinners/GridLoader';

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


function App() {
	
	return (
		<div className="container mt-4 inner-container">
			<Switch>
				{/*<Route exact path='/'>*/}
				{/*	<Redirect to='/blog'/>*/}
				{/*</Route>*/}
				<Route path='/login' component={LoginPage}/>
				<Route path='/register' component={RegisterPage}/>
				<Route path='/blog' exact component={BlogPage}/>
				<SecureRoute path='/account' component={AccountPage}/>
			</Switch>
		</div>
	);
}

export function PageLoaderSpinner(props) {
	const {error, pastDelay} = props;
	if (error) {
		console.log(props.error);
		return <div>Error! <button onClick={props.retry}>Retry</button></div>;
	} else if (pastDelay) {
		return <GridLoader css={css`display: block;`}
						   sizeUnit={"px"}
						   color={'#6c757d'}
						   loading={true}/>;
	}
	return null;
}

export default App;
