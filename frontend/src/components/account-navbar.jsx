/** @jsx jsx */
import React, { Component, useState } from 'react';
import { jsx } from "@emotion/core";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import RolePermission from "./role-permission";
import {
	ROLE_ADMIN,
	ACC_NAVBAR_MEETINGS,
	ACC_NAVBAR_BILLING,
	ACC_NAVBAR_NOTIFICATIONS,
	ACC_NAVBAR_MANAGEMENT
} from "../common";

const TAB_ACTIVE = 'active';

const styles = {
	navbar: {
		margin: '0 0 1rem 0',
	}
};

export function AccountNavbar({activeTab}) {
	return (
		<Nav tabs css={styles.navbar}>
			<NavItem>
				<Link
					className={'nav-link ' + (activeTab === ACC_NAVBAR_MEETINGS ? TAB_ACTIVE : '')}
					to='/account'
				>Meetings
				</Link>
			</NavItem>
			<NavItem>
				
				<Link
					className={'nav-link ' + (activeTab === ACC_NAVBAR_BILLING ? TAB_ACTIVE : '')}
					to='/account/billing'
				>
					Billing
				</Link>
			</NavItem>
			<NavItem>
				
				<Link
					className={'nav-link ' + (activeTab === ACC_NAVBAR_NOTIFICATIONS ? TAB_ACTIVE : '')}
					to='/account/notifications'
				>
					Notifications
				</Link>
			</NavItem>
			
			<RolePermission roles={[ROLE_ADMIN]}>
				<NavItem>
					<Link
						className={'nav-link ' + (activeTab === ACC_NAVBAR_MANAGEMENT ? TAB_ACTIVE : '')}
						to='/account/management'
					>
						<b>Management</b>
					</Link>
				</NavItem>
			</RolePermission>
		</Nav>
	)
}

AccountNavbar.propTypes = {
	activeTab: PropTypes.number.isRequired
};
