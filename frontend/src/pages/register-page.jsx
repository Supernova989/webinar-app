/** @jsx jsx */
import React, { useState } from 'react';
import { Button, Input, InputGroup, UncontrolledAlert, Alert } from "reactstrap";
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
	},
	successWrap: {
		position: 'relative',
		maxWidth: '100%',
		background: '#FFFFFF',
		width: 450,
		marginLeft: 'auto',
		marginRight: 'auto',
		border: '1px solid #cecece',
		padding: '0.5rem 0.5rem 0.5rem 0.5rem',
		borderRadius: '0.25em'
	},
};

const USERNAME_MAX = 20;
const USERNAME_MIN = 4;
const FNAME_MIN = 2;
const NAME_MAX = 64;
const EMAIL_MAX = 80;
const EMAIL_MIN = 5;
const PWD_MAX = 20;
const PWD_MIN = 4;

function RegisterPage({dispatch, history, auth}) {
	
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [errors, setErrors] = useState([]);
	const [success, setSuccess] = useState(false);
	
	const emailOK = email.length >= EMAIL_MIN && email.length <= EMAIL_MAX && isEmailValid(email);
	const pwdOK = password.length >= PWD_MIN && passwordConfirm.length >= PWD_MIN && password.length <= PWD_MAX && passwordConfirm.length <= PWD_MAX;
	const usrOK = username.length >= USERNAME_MIN && username.length <= USERNAME_MAX;
	const namesOK = firstName.length >= FNAME_MIN && firstName.length <= NAME_MAX && lastName.length <= NAME_MAX;
	const allOk = emailOK && pwdOK && namesOK && usrOK;
	
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
		if (allOk) {
			setErrors([]);
			dispatch(register_user(username, email, password, passwordConfirm, firstName, lastName))
				.then((data) => {
					console.log('====>', data);
					// dispatch(set_credentials({token: accessToken, user}));
					setSuccess(true);
				})
				.catch(({message, name, ...rest}) => {
					setPassword('');
					setPasswordConfirm('');
					setErrors([]);
					if (name === API_ERROR_NAME_NOT_AUTHENTICATED) {
						setErrors([{id: 0, message}]);
					} else if (name === API_ERROR_BAD_REQUEST) {
						if (Array.isArray(rest.errors)) {
							const errs = rest.errors.map(e => {
								return {id: e.id, message: e.message};
							});
							setErrors(errs);
						}
					} else {
						setErrors([{id: 0, message: API_GENERAL_ERROR_MESSAGE}]);
					}
				})
				.finally(() => {
					dispatch({type: LOGIN_FETCH_FULFILLED});
				});
		}
	};
	
	if (success) {
		return (
			<>
				<form css={styles.successWrap} autoComplete='off'>
					<Alert color='success' className='text-center'>
						<div className='font-weight-bold'>Congratulations!</div>
						<p>
							You have successfully registered your account. Please, check your email to activate it.
						</p>
					</Alert>
					
					<Button block={true} to='/account' tag={Link} color='primary'>Sing in</Button>
				</form>
			</>
		)
	}
	
	return (
		<>
			<form css={styles.formWrap} autoComplete='off'>
				
				<div css={styles.formTitle}>SIGN UP</div>
				
				<fieldset disabled={auth.isFetching}>
					{/* First name */}
					<InputGroup className='mb-3'>
						<Input type="text" name="firstName" placeholder="Your First name" onChange={onFirstNameChange}
							   maxLength={NAME_MAX} value={firstName}/>
					</InputGroup>
					
					{/* Last name */}
					<InputGroup className='mb-3'>
						<Input type="text" name="lastName" placeholder="Your Last name" onChange={onLastNameChange}
							   maxLength={NAME_MAX} value={lastName}/>
					</InputGroup>
					
					{/* Username */}
					<InputGroup className='mb-3'>
						<Input type="text" name="username" placeholder="Your Username" onChange={onUsernameChange}
							   maxLength={USERNAME_MAX} value={username}/>
					</InputGroup>
					
					<InputGroup className='mb-3'>
						<Input type="email" name="email" placeholder="Your Email" onChange={onEmailChange}
							   maxLength={EMAIL_MAX} value={email}/>
					</InputGroup>
					
					<InputGroup className='mb-3'>
						<Input type="password" name="password" placeholder="Your Password" onChange={onPasswordChange}
							   maxLength={PWD_MAX} value={password}/>
					</InputGroup>
					
					<InputGroup className='mb-3'>
						<Input type="password" name="passwordConfirm" placeholder="Confirm Password"
							   onChange={onPasswordConfirmChange}
							   maxLength={PWD_MAX} value={passwordConfirm}/>
					</InputGroup>
					
					<Button block color='primary' type='button'
							onClick={submitForm}
							className={allOk  || !auth.isFetching ? '' : 'disabled'}
							disabled={!allOk}>Register</Button>
					
					<hr/>
					
					<div css={styles.formBottom}>
						<small><Link to='/login'>Already have an account?</Link></small>
					</div>
				</fieldset>
			
			</form>
			
			{errors && errors.length > 0 && errors.map(e => {
				return(
					<div key={e.id} css={styles.alertArea}>
						<UncontrolledAlert className='mt-2' color='danger'>{e.message}</UncontrolledAlert>
					</div>
				)
			})}
		</>
	)
}

function mapStatesToProps(state) {
	return {
		auth: state.auth
	}
}

export default connect(mapStatesToProps)(RegisterPage);
