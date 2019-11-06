/** @jsx jsx */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { css, jsx } from "@emotion/core";
import { fetchSubscriptionInfo } from '../actions';
import {
	Alert,
	Card,
	CardHeader,
} from "reactstrap";
import { Switch, Route, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { AccountNavbar } from "../components/account-navbar";
import {
	ACC_NAVBAR_BILLING,
	ACC_NAVBAR_MANAGEMENT,
	ACC_NAVBAR_MEETINGS,
	ACC_NAVBAR_NOTIFICATIONS,
	ACC_NAVBAR_ZOOM,
	ROLE_USER,
	ROLE_ASSISTANT,
	ROLE_ADMIN
} from "../common";
import SecureRoute from "../components/secure-route";
import Loadable from "react-loadable";
import { PageLoaderSpinner } from "../App";
import moment from "moment";
import GridLoader from "react-spinners/GridLoader";
import { LoaderSpinner } from "../components/loader-spinner";

const MeetingsContainer = Loadable({
	loader: () => import('../components/meetings-container'),
	loading: LoaderSpinner,
	delay: 300,
});
const BillingContainer = Loadable({
	loader: () => import('../components/billing-container'),
	loading: LoaderSpinner,
	delay: 300,
});
const ZoomContainer = Loadable({
	loader: () => import('../components/zoom-container'),
	loading: LoaderSpinner,
	delay: 300,
});
const NotificationsContainer = Loadable({
	loader: () => import('../components/notifications-container'),
	loading: LoaderSpinner,
	delay: 300,
});
const ManagementContainer = Loadable({
	loader: () => import('../components/notifications-container'),
	loading: LoaderSpinner,
	delay: 300,
});

const paths = {
	account: '/account',
	billing: '/account/billing',
	notifications: '/account/notifications',
	zoom: '/account/zoom',
	management: '/account/management',
};

function AccountPage({auth, dispatch, meeting, sub, ...rest}) {
	let activeTab = ACC_NAVBAR_MEETINGS;
	const {pathname} = rest.history.location;
	
	useEffect(() => {
		const now = moment();
		if (((sub.lastFetch && now.diff(sub.lastFetch, 'seconds') > 60) || !sub.lastFetch) && auth.user.role !== ROLE_ADMIN) {
			dispatch(fetchSubscriptionInfo());
		}
	}, [sub.lastFetch]);
	

	switch (pathname) {
		case paths.account:
			activeTab = ACC_NAVBAR_MEETINGS;
			break;
		case paths.billing:
			activeTab = ACC_NAVBAR_BILLING;
			break;
		case paths.notifications:
			activeTab = ACC_NAVBAR_NOTIFICATIONS;
			break;
		case paths.zoom:
			activeTab = ACC_NAVBAR_ZOOM;
			break;
		case paths.management:
			activeTab = ACC_NAVBAR_MANAGEMENT;
	}
	
	// MTrQ1aTwTLOp7H6pdZLIXA
	return (
		<>
			<Card>
				<CardHeader>
					<AccountNavbar activeTab={activeTab}/>
				</CardHeader>
				<section className="account-content">
					<Switch>
						<Route path={paths.account} exact component={MeetingsContainer}/>
						<SecureRoute roles={[ROLE_USER, ROLE_ASSISTANT]} path={paths.billing} component={BillingContainer}/>
						<SecureRoute roles={[ROLE_USER, ROLE_ASSISTANT]} path={paths.zoom} component={ZoomContainer}/>
						<Route path={paths.notifications} exact component={NotificationsContainer}/>
						<SecureRoute roles={[ROLE_ADMIN]} path={paths.management} component={ManagementContainer}/>
					</Switch>
				
				</section>
				
			</Card>
		</>
	)
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		sub: state.sub,
		meeting: state.meeting,
	};
}

export default connect(mapStateToProps)(withRouter(AccountPage));
