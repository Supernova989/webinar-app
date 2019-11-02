import React, {useEffect} from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';
import { log_out } from "../actions";


function SecureRoute({path, component, roles = [], dispatch, auth}) {
	
	function ProtectedComponent(props) {
		const C = component;
		const redirectToLogin = <Redirect path={path} to={`/login?r=${path}`}/>;
		
		if (!props.auth.token) {
			if (window) {
				window.r = path;
			}
			return redirectToLogin;
		}
		
		const decoded = jwt.decode(props.auth.token);
		
		if (!decoded) {
			dispatch(log_out());
			return redirectToLogin;
		}
		
		if (roles.length > 0 && roles.indexOf(decoded.role) === -1) {
			// render NoRights page
			return <Redirect to={{
				pathname: '/forbidden',
				state: { blocked: true }
			}}/>
		}
		
		return <Route path={path} component={() => <C/>}/>
	}
	
	const PC = connect(mapStateToProps)(ProtectedComponent);
	return <PC/>;
}

SecureRoute.propTypes = {
	path: PropTypes.string.isRequired,
	component: PropTypes.any.isRequired,
	roles: PropTypes.arrayOf(PropTypes.number)
};

function mapStateToProps(state) {
	return {
		auth: state.auth
	};
}

export default connect(mapStateToProps)(SecureRoute);
