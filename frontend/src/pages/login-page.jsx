/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { jsx } from '@emotion/core';
import { connect } from "react-redux";
import {validate as isEmailValid}  from 'email-validator';
import {
	UncontrolledAlert,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Button,
} from 'reactstrap';
import { Link } from "react-router-dom";
import {
	faEnvelope,
	faLock
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { authenticate, set_credentials } from '../actions';
import {
	API_ERROR_NAME_NOT_AUTHENTICATED,
	API_GENERAL_ERROR_MESSAGE
} from '../common';
import { LOGIN_FETCH_FULFILLED } from "../actions/types";

const styles = {
	formTitle: {
		position: 'absolute',
		padding: '0.5rem',
		zIndex: 10,
		top: -21,
		left: '50%',
		margin: '0 0 0 -40px',
		width: 80,
		textAlign: 'center',
		background: '#FFFFFF',
		borderRadius: '0.25em',
		border: '1px solid #cecece',
	},
	formWrap: {
		position: 'relative',
		maxWidth: '100%',
		background: '#FFFFFF',
		width: 370,
		marginLeft: 'auto',
		marginRight: 'auto',
		border: '1px solid #cecece',
		padding: '3rem 0.5rem 0.5rem 0.5rem',
		borderRadius: '0.25em'
	},
	formBottom: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	alertArea: {
		marginLeft: 'auto',
		marginRight: 'auto',
		width: 370,
		maxWidth: '100%',
	}
};

export function LoginPage({dispatch, history, auth}) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	
	if (auth.token) {
		history.push('/account')
	}
	
	const onEmailChange = (e) => {
		setEmail(e.target.value);
	};
	
	const onPasswordChange = (e) => {
		setPassword(e.target.value);
	};
	
	useEffect(() => {
		const isSupported = window && window.addEventListener;
		if (!isSupported) return;
		const eventName = 'keypress';
		window.addEventListener(eventName, handleEnterPress);
		return () => {
			window.removeEventListener(eventName, handleEnterPress);
		};
	});
	
	useEffect(() => {
		if (!auth.token) {
			return;
		}
		if (window.r) {
			history.replace(window.r);
			delete window.r;
		}
	}, [auth]);
	
	const submitForm = () => {
		setError(null);
		dispatch(authenticate(email, password))
			.then(({accessToken, user}) => {
				dispatch(set_credentials({token: accessToken, user}));
			})
			.catch(({message, name, ...rest}) => {
				setPassword('');
				if (name === API_ERROR_NAME_NOT_AUTHENTICATED) {
					setError(message);
				}
				else {
					setError(API_GENERAL_ERROR_MESSAGE)
				}
			})
			.finally(() => {
				dispatch({type: LOGIN_FETCH_FULFILLED});
			});
	};
	
	function handleEnterPress({key, code}) {
		if (key === 'Enter' || code === 'Enter') {
			submitForm();
		}
	}
	
	const emailOK = email.length > 4 && isEmailValid(email);
	const pwdOK = password.length > 4;
	
	return (
		<>
			<form css={styles.formWrap} autoComplete='off'>
				
				<div css={styles.formTitle}>SIGN IN</div>
				
				<fieldset disabled={auth.isFetching}>
					<InputGroup className='mb-3'>
						<InputGroupAddon addonType="prepend">
							<InputGroupText css={{width: 44, justifyContent: 'center'}}>
								<FontAwesomeIcon icon={faEnvelope} color='#676767'/>
							</InputGroupText>
						</InputGroupAddon>
						<Input type="email" name="email" placeholder="user@domain.com" onChange={onEmailChange}
							   maxLength={80} value={email}/>
					</InputGroup>
					
					<InputGroup className='mb-3'>
						<InputGroupAddon addonType="prepend">
							<InputGroupText css={{width: 44, justifyContent: 'center'}}>
								<FontAwesomeIcon icon={faLock} color='#676767'/>
							</InputGroupText>
						</InputGroupAddon>
						<Input type="password" name="password" maxLength={20} onChange={onPasswordChange}
							   value={password}/>
					</InputGroup>
					
					<Button block color='primary' type='button'
							onClick={submitForm}
							className={(emailOK && pwdOK) === true ? '' : 'disabled'}
							disabled={(emailOK && pwdOK) === false}>Submit</Button>
					
					<hr/>
					
					<div css={styles.formBottom}>
						<small><Link to='/register'>Create an account</Link></small>
						<small><Link to='/forgot'>Forgot password</Link></small>
					</div>
				</fieldset>
			
			</form>
			
			{error && <div css={styles.alertArea}>
				<UncontrolledAlert className='mt-2' color='danger'>{error}</UncontrolledAlert>
			</div>}
			
		</>
	)
}

function mapStatesToProps(state) {
	return {
		auth: state.auth
	}
}

export default connect(mapStatesToProps)(LoginPage);
