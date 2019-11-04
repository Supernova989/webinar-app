/** @jsx jsx */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { jsx } from "@emotion/core";
import { fetch_meetings } from "../actions";
import { MeetingCard } from "../components/meeting-card";
import {
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Button,
	Input,
	InputGroup,
	UncontrolledAlert,
	Alert
} from "reactstrap";
import { Switch, Route, Redirect, withRouter } from 'react-router';
import { AccountNavbar } from "../components/account-navbar";
import RolePermission from "../components/role-permission";

import {
	ACC_NAVBAR_BILLING,
	ACC_NAVBAR_MANAGEMENT,
	ACC_NAVBAR_MEETINGS,
	ACC_NAVBAR_NOTIFICATIONS,
	ROLE_ADMIN
} from "../common";
import SecureRoute from "../components/secure-route";
import Loadable from "react-loadable";
import { PageLoaderSpinner } from "../App";

const MeetingsContainer = Loadable({
	loader: () => import('../components/meetings-container'),
	loading: PageLoaderSpinner,
	delay: 300,
});

const BillingContainer = Loadable({
	loader: () => import('../components/billing-container'),
	loading: PageLoaderSpinner,
	delay: 300,
});

const paths = {
	account: '/account',
	billing: '/account/billing',
	notifications: '/account/notifications',
	management: '/account/management',
};

function AccountPage({dispatch, meeting, ...rest}) {
	let activeTab = ACC_NAVBAR_MEETINGS;
	const {pathname} = rest.history.location;
	console.log();
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
		case paths.management:
			activeTab = ACC_NAVBAR_MANAGEMENT;
	}
	return (
		<>
			<AccountNavbar activeTab={activeTab}/>
			
			<Switch>
				<Route path={paths.account} exact component={MeetingsContainer}/>
				<Route path={paths.billing} exact component={BillingContainer}/>
				<Route path={paths.notifications} exact component={() => <div>Notifications</div>}/>
				<SecureRoute roles={[ROLE_ADMIN]} path={paths.management} component={() => <div>Management</div>}/>
			</Switch>
		</>
	)
}

function mapStateToProps(state) {
	return {
		meeting: state.meeting
	};
}

export default connect(mapStateToProps)(withRouter(AccountPage));
