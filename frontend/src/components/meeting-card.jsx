/** @jsx jsx */
import React from 'react';
import { jsx } from "@emotion/core";
import moment from "moment";
import {
	Button, Card, CardBody, CardHeader, CardFooter
} from "reactstrap";


const styles = {
	meeting: {},
	headerInner: {
		display: 'flex',
		width: '100%',
		alignItems: 'center'
	},
	topic: {
		flexGrow: 1
	},
	date: {},
	footerInner: {
		display: 'flex',
		width: '100%',
		alignItems: 'center'
	},
	participants: {
		flexGrow: 1
	}
};

export const MeetingCard = ({id, agenda, topic, start_time}) => {
	const start = moment(start_time).format('HH:mm DD.MM.YYYY');
	return (
		<Card css={styles.meeting}>
			<CardHeader>
				<div css={styles.headerInner}>
					<span css={styles.topic}>{topic}</span>
					<span css={styles.date}>{start}</span>
				</div>
			</CardHeader>
			<CardBody>
				<p>{agenda}</p>
			</CardBody>
			<CardFooter>
				<div css={styles.footerInner}>
					<span css={styles.participants}></span>
					<div>
						<Button>Enroll</Button>
					</div>
				</div>
			
			</CardFooter>
		</Card>
	)
};

