/** @jsx jsx */
import React, { useEffect } from "react";
import { MeetingCard } from "./meeting-card";
import { jsx } from "@emotion/core";
import { connect } from 'react-redux';
import { fetch_meetings } from "../actions";

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

const MeetingsContainer = ({dispatch, meeting}) => {
	const fetch_subs = () => {
		return dispatch(fetch_meetings());
	};
	
	useEffect(() => {
		fetch_subs()
			.then(() => {
			
			})
			.catch(() => {
			
			});
	}, []);
	
	return (
		<>
			<ul css={styles.meetingList}>
				{meeting.items && meeting.items.map((item) => {
					return (
						<li key={item.id} css={styles.meetingWrap}>
							<MeetingCard id={item.id} topic={item.topic} agenda={item.agenda} start_time={item.start_time}/>
						</li>
					)
				})}
			</ul>
		</>
	)
};


function mapStateToProps(state) {
	return {
		meeting: state.meeting
	};
}

export default connect(mapStateToProps)(MeetingsContainer);
