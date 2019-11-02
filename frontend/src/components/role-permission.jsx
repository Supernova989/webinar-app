import React from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

function RolePermission(props) {
	const roles = props.roles || [];
	const role = props.auth.user.role || null;
	if (role && roles.indexOf(role) !== -1) {
		return props.children
	}
	return null;
}

RolePermission.propTypes = {
	roles: PropTypes.arrayOf(PropTypes.number).isRequired
};

function mapStateToProps(state) {
	return {
		auth: state.auth
	};
}

export default connect(mapStateToProps)(RolePermission);
