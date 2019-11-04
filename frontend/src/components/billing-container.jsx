/** @jsx jsx */
import React, { useEffect } from "react";
import { MeetingCard } from "./meeting-card";
import { jsx } from "@emotion/core";
import { connect } from 'react-redux';
import { fetch_meetings, order_subscription } from "../actions";
import { Button } from "reactstrap";


const styles = {


};

const BillingContainer = ({dispatch}) => {
	// const fetch_subs = () => {
	// 	return dispatch(fetch_meetings());
	// };
	
	useEffect(() => {
		// fetch_subs()
		// 	.then(() => {
		//
		// 	})
		// 	.catch(() => {
		//
		// 	});
	}, []);
	
	const onClickSubscribe = () => {
		dispatch(order_subscription());
	};
	
	return (
		<>
			
			<Button onClick={onClickSubscribe}>Subscribe</Button>
		</>
	)
};


function mapStateToProps(state) {
	return {
		meeting: state.meeting
	};
}

export default connect(mapStateToProps)(BillingContainer);
