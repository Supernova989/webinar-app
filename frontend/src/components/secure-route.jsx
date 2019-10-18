import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';


function SecureRoute({path, component, roles = []}) {
	class ProtectedComponent extends Component {
		getRules() {
		
		}
		render() {
			const C = component;
			const redirectToLogin = <Redirect path={path} to={`/login?r=${path}`}/>;
		
			if (!this.props.auth.token) {
				return redirectToLogin;
			}
			
			const decoded = jwt.decode(this.props.auth.token);
			if (!decoded) {
				// todo: use an Action to remove
				localStorage.removeItem('token');
				return redirectToLogin;
			}
			// console.log('token in LOCAL ', this.props.auth.token);
			// console.log('token: ', decoded);
			
			// todo check permissions via indexOf
			return <Route path={path} exact component={() => <C/>}/>
		}
	}
	
	const PC = connect(mapStateToProps)(ProtectedComponent);
	return <PC/>;
}

SecureRoute.propTypes = {
	path: PropTypes.string.isRequired,
	component: PropTypes.any.isRequired,
	roles: PropTypes.arrayOf(PropTypes.Number)
};

function mapStateToProps(state) {
	return {
		auth: state.auth
	};
}

export default SecureRoute;
