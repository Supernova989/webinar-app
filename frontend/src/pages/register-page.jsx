/** @jsx jsx */
import React, { useState } from 'react';
import { Button, Input, InputGroup, UncontrolledAlert } from "reactstrap";
import { Link } from "react-router-dom";
import { jsx } from "@emotion/core";
import { connect } from "react-redux";
import { validate as isEmailValid } from 'email-validator';
import { register_user } from "../actions";
import {
	API_ERROR_NAME_NOT_AUTHENTICATED,
	API_GENERAL_ERROR_MESSAGE,
	API_ERROR_BAD_REQUEST
} from "../common";
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


function RegisterPage({dispatch, history, auth}) {
	
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [error, setError] = useState(null);
	
	if (auth.token) {
		history.push('/account')
	}
	
	const onUsernameChange = (e) => {
		setUsername(e.target.value);
	};
	
	const onEmailChange = (e) => {
		setEmail(e.target.value);
	};
	
	const onPasswordChange = (e) => {
		setPassword(e.target.value);
	};
	
	const onPasswordConfirmChange = (e) => {
		setPasswordConfirm(e.target.value);
	};
	
	const onFirstNameChange = (e) => {
		setFirstName(e.target.value);
	};
	
	const onLastNameChange = (e) => {
		setLastName(e.target.value);
	};
	
	
	const submitForm = () => {
		setError(null);
		dispatch(register_user(username, email, password, passwordConfirm, firstName, lastName))
			.then((data) => {
				console.log('====>', data);
				// dispatch(set_credentials({token: accessToken, user}));
			})
			.catch(({message, name, ...rest}) => {
				setPassword('');
				setPasswordConfirm('');
				if (name === API_ERROR_NAME_NOT_AUTHENTICATED) {
					setError(message);
				} else if (name === API_ERROR_BAD_REQUEST) {
					setError(message)
				} else {
					setError(API_GENERAL_ERROR_MESSAGE)
				}
			})
			.finally(() => {
				dispatch({type: LOGIN_FETCH_FULFILLED});
			});
	};
	
	
	const emailOK = email.length > 4 && email.length < 80 && isEmailValid(email);
	const pwdOK = password.length > 4 && password.length < 20 && passwordConfirm.length > 4 && passwordConfirm.length < 20;
	const usrOK = username.length > 4 && username.length < 20;
	const namesOK = firstName.length > 2 & lastName.length > 2 && firstName.length < 64 && lastName.length < 64;
	return (
		<>
			<form css={styles.formWrap} autoComplete='off'>
				
				<div css={styles.formTitle}>SIGN UP</div>
				
				<fieldset disabled={auth.isFetching}>
					{/* First name */}
					<InputGroup className='mb-3'>
						<Input type="text" name="firstName" placeholder="Your First name" onChange={onFirstNameChange}
							   maxLength={64} value={firstName}/>
					</InputGroup>
					
					{/* Last name */}
					<InputGroup className='mb-3'>
						<Input type="text" name="lastName" placeholder="Your Last name" onChange={onLastNameChange}
							   maxLength={64} value={lastName}/>
					</InputGroup>
					
					{/* Username */}
					<InputGroup className='mb-3'>
						<Input type="text" name="username" placeholder="Your Username" onChange={onUsernameChange}
							   maxLength={20} value={username}/>
					</InputGroup>
					
					<InputGroup className='mb-3'>
						<Input type="email" name="email" placeholder="Your Email" onChange={onEmailChange}
							   maxLength={80} value={email}/>
					</InputGroup>
					
					<InputGroup className='mb-3'>
						<Input type="password" name="password" placeholder="Your Password" onChange={onPasswordChange}
							   maxLength={20} value={password}/>
					</InputGroup>
					
					<InputGroup className='mb-3'>
						<Input type="password" name="passwordConfirm" placeholder="Confirm Password"
							   onChange={onPasswordConfirmChange}
							   maxLength={20} value={passwordConfirm}/>
					</InputGroup>
					
					<Button block color='primary' type='button'
							onClick={submitForm}
							className={(emailOK && pwdOK && namesOK && usrOK) === true ? '' : 'disabled'}
							disabled={(emailOK && pwdOK && namesOK && usrOK) === false}>Register</Button>
					
					<hr/>
					
					<div css={styles.formBottom}>
						<small><Link to='/login'>Already have an account?</Link></small>
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

export default connect(mapStatesToProps)(RegisterPage);
