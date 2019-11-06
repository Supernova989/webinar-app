/** @jsx jsx */
import React, { useEffect } from "react";
import { MeetingCard } from "./meeting-card";
import { jsx } from "@emotion/core";
import { connect } from 'react-redux';
import { Alert } from 'reactstrap'
import { fetch_meetings } from "../actions";
import { ROLE_ADMIN } from "../common";
import { LoaderSpinner } from "./loader-spinner";
import { Link } from "react-router-dom";

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

const MeetingsContainer = ({dispatch, auth, sub, meeting}) => {
	const fetch_subs = () => {
		return dispatch(fetch_meetings());
	};
	
	useEffect(() => {
		if (sub.active || auth.user.role === ROLE_ADMIN) {
			console.log('Starting to fetch!');
			fetch_subs()
				.then(() => {
				
				})
				.catch(() => {
				
				});
		}
		
	}, []);
	
	if (sub.isFetching) {
		return (
			<>
				<LoaderSpinner/>
			</>)
	}
	
	return (
		<>
			{!auth.user.hasZoom && auth.user.role !== ROLE_ADMIN &&
			<Alert color='warning'><b>You do not have a Zoom account linked to your account. It is required for
				attending our lessons. <Link to='/account/zoom'><u>Click here</u></Link> to fix it.</b></Alert>
			}
			{auth.user.hasZoom && !auth.user.verified && auth.user.role !== ROLE_ADMIN &&
			<Alert color='warning'><b>You have not confirmed your Zoom account's email. It is required for
				attending our lessons.</b></Alert>
			}
			{!sub.active && auth.user.role !== ROLE_ADMIN &&
			<Alert color='warning'>You do not have an active subscription. Showing upcoming lessons is disabled.</Alert>
			}
			{sub.active &&
			<ul css={styles.meetingList}>
				{meeting.items && meeting.items.map((item) => {
					return (
						<li key={item.id} css={styles.meetingWrap}>
							<MeetingCard id={item.id} topic={item.topic} agenda={item.agenda}
										 start_time={item.start_time}/>
						</li>
					)
				})}
				{meeting.items && meeting.items.length === 0 &&
				<li><Alert color='info'>No upcoming lessons found</Alert></li>
				}
			</ul>
			}
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

export default connect(mapStateToProps)(MeetingsContainer);
