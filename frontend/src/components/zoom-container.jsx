/** @jsx jsx */
import React, { useEffect } from "react";
import { MeetingCard } from "./meeting-card";
import { jsx } from "@emotion/core";
import { connect } from 'react-redux';
import { Alert, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import { fetch_meetings } from "../actions";
import { ROLE_ADMIN } from "../common";

const styles = {


};

const ZoomContainer = ({dispatch, auth, sub, meeting}) => {
	
	useEffect(() => {
	
	
	}, []);
	
	return (
		<>
			{!auth.user.hasZoom && auth.user.role !== ROLE_ADMIN && <>
				<Alert color='warning' fade={false}>
					Please enter your Zoom account's email. If you do not have one, enter an email, and
					Zoom will send an invitation to it.
				</Alert>
				<InputGroup>
					<InputGroupAddon addonType="prepend">@</InputGroupAddon>
					<Input placeholder="Email for your Zoom account" />
					<InputGroupAddon addonType="append"><Button color="primary">OK</Button></InputGroupAddon>
				
				</InputGroup>
			</>}
		</>
	)
};


function mapStateToProps(state) {
	return {
		meeting: state.meeting,
		auth: state.auth,
		sub: state.sub,
		
	};
}

export default connect(mapStateToProps)(ZoomContainer);
