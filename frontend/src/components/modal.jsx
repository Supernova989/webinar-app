import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from "prop-types";


export const ModalWnd = (props) => {
	const {title} = props;
	let promise = {};
	const [active, setActive] = useState(false);
	const show = async () => {
		return new Promise((resolve, reject) => {
			promise = {
				resolve,
				reject
			};
			setActive(true);
		});
	};
	const hide = () => {
		setActive(false);
	};
	
	
	return (
		<Modal isOpen={active}>
			<ModalHeader>{title}</ModalHeader>
			<ModalBody>
				{props.children}
			</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={() => {
					hide();
					promise.resolve()
				}}>Ok</Button>{' '}
				<Button color="danger" onClick={() => {
					hide();
					promise.reject()
				}}>Cancel</Button>
			</ModalFooter>
		</Modal>
	);
};

ModalWnd.propTypes = {
	title: PropTypes.string.isRequired,
	// isOpen: PropTypes.bool.isRequired,
};




