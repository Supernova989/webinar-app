/** @jsx jsx */
import React, { useHook } from 'react';
import { css, jsx } from '@emotion/core';
import {
	Form,
	FormGroup,
	Label,
	Input,
	FormFeedback,
	FormText,
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
	}
};

function LoginPage(props) {
	
	
	return (
		<>
			<div css={styles.formWrap}>
				<div css={styles.formTitle}>SIGN IN</div>
				<InputGroup className='mb-3'>
					<InputGroupAddon addonType="prepend">
						<InputGroupText css={{width: 44, justifyContent: 'center'}}><FontAwesomeIcon icon={faEnvelope}
																									 color='#676767'/></InputGroupText>
					</InputGroupAddon>
					<Input type="email" name="email" placeholder="user@domain.com" maxLength={80}/>
				</InputGroup>
				
				
				<InputGroup className='mb-3'>
					<InputGroupAddon addonType="prepend">
						<InputGroupText css={{width: 44, justifyContent: 'center'}}><FontAwesomeIcon icon={faLock}
																									 color='#676767'/></InputGroupText>
					</InputGroupAddon>
					<Input type="password" name="password" maxLength={20}/>
				</InputGroup>
				
				<Button block color='primary'>Submit</Button>
				<hr/>
				<div css={styles.formBottom}>
					<small><Link to='/register'>Don't have an account? Register</Link></small>
					<small><Link to='/register'>Forgot password</Link></small>
				</div>
			
			</div>
			
			{/*<FormFeedback>You will not be able to see this</FormFeedback>*/}
			{/*<FormText>Example help text that remains unchanged.</FormText>*/}
			
			{/*<FormGroup>*/}
			{/*	<Label for="exampleEmail">Valid input</Label>*/}
			{/*	<Input valid/>*/}
			{/*	<FormFeedback valid>Sweet! that name is available</FormFeedback>*/}
			{/*	<FormText>Example help text that remains unchanged.</FormText>*/}
			{/*</FormGroup>*/}
			{/*<FormGroup>*/}
			{/*	<Label for="examplePassword">Invalid input</Label>*/}
			{/*	<Input invalid/>*/}
			{/*	<FormFeedback>Oh noes! that name is already taken</FormFeedback>*/}
			{/*	<FormText>Example help text that remains unchanged.</FormText>*/}
			{/*</FormGroup>*/}
			{/*<FormGroup>*/}
			{/*	<Label for="exampleEmail">Input without validation</Label>*/}
			{/*	<Input/>*/}
			{/*	<FormFeedback tooltip>You will not be able to see this</FormFeedback>*/}
			{/*	<FormText>Example help text that remains unchanged.</FormText>*/}
			{/*</FormGroup>*/}
			{/*<FormGroup>*/}
			{/*	<Label for="exampleEmail">Valid input</Label>*/}
			{/*	<Input valid/>*/}
			{/*	<FormFeedback valid tooltip>Sweet! that name is available</FormFeedback>*/}
			{/*	<FormText>Example help text that remains unchanged.</FormText>*/}
			{/*</FormGroup>*/}
			{/*<FormGroup>*/}
			{/*	<Label for="examplePassword">Invalid input</Label>*/}
			{/*	<Input invalid/>*/}
			{/*	<FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback>*/}
			{/*	<FormText>Example help text that remains unchanged.</FormText>*/}
			{/*</FormGroup>*/}
		
		</>
	
	)
}

export default LoginPage;
