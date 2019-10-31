import React from "react";
import { Redirect } from "react-router-dom";

const ForbiddenPage = (props) => {
	const {location} = props;
	if (location.state && location.state.blocked) {
		return (
			<div>
				<h1>You do not have permissions to access this page</h1>
			</div>
		)
	}
	return <Redirect to='/account'/>
};

export default ForbiddenPage;
