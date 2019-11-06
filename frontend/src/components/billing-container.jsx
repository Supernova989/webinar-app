/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/core";
import { connect } from 'react-redux';
import { order_subscription, change_subscription_status } from "../actions";
import { Button, Card, CardHeader, CardBody, CardFooter, Table } from "reactstrap";
import moment from "moment";
import { LoaderSpinner } from "./loader-spinner";


const styles = {
	heading: {
		display: 'flex',
		alignItems: 'center',
	},
	title: {
		flexGrow: 1,
		margin: 0
	},
	card: {
		marginBottom: '1rem'
	}
};

class BillingContainer extends React.Component {
	constructor(props) {
		super(props);
	}
	
	onClickSubscribe = () => {
		this.props.dispatch(order_subscription());
	};
	onClickRenew = () => {
		this.props.dispatch(change_subscription_status(true));
	};
	onClickUnsubscribe = () => {
		this.props.dispatch(change_subscription_status(false));
	};
	
	render() {
		let actionButton = null;
		const {sub} = this.props;
		
		if (!sub.active) {
			actionButton = <Button block color='success' onClick={this.onClickSubscribe}>Subscribe</Button>;
		} else if (sub.active && sub.has_scheduled_cancellation) {
			actionButton = <Button block color='primary' onClick={this.onClickRenew}>Renew subscription</Button>;
		} else if (sub.active && !sub.has_scheduled_cancellation) {
			actionButton = <Button block color='danger' onClick={this.onClickUnsubscribe}>Cancel subscription</Button>;
		}
		
		return (
			<>
				{sub.isFetching ?
					<LoaderSpinner/>
					:
					<>
						<Card css={styles.card}>
							<CardHeader>
								<span>Subscription details</span>
							</CardHeader>
							<CardBody>
								You have an active subscription. Next billing date is on
							</CardBody>
							<CardFooter>
								<div css={styles.heading}>
									{actionButton}
								</div>
							</CardFooter>
						</Card>
					</>
				}
			</>
		)
		
	}
}


function mapStateToProps(state) {
	return {
		sub: state.sub
	};
}

export default connect(mapStateToProps)(BillingContainer);
