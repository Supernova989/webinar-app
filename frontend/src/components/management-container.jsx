/** @jsx jsx */
import React, { useEffect } from "react";
import { MeetingCard } from "./meeting-card";
import { jsx } from "@emotion/core";
import { connect } from 'react-redux';
import { Alert } from 'reactstrap'
import { fetch_meetings } from "../actions";
import { ROLE_ADMIN } from "../common";

const styles = {
	meetingList: {
		padding: 0,
		margin: '0 0 1rem 0',
		listStyle: 'none'
	},
	meetingWrap: {
		padding: 0,
		margin: '0 0 1rem 0',
	},
	meeting: {}
};

const ManagementContainer = ({dispatch, auth, sub, meeting}) => {
	
	useEffect(() => {
	
	
	}, []);
	
	return (
		<>
		
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

export default connect(mapStateToProps)(ManagementContainer);
