import { LOG_OUT, SET_CREDENTIALS } from "./types";
import { apiAuthentication, getService } from "../feathers-client";

export const log_out = () => {
	return {
		type: LOG_OUT
	}
};

export const set_credentials = ({token, user}) => {
	return {
		type: SET_CREDENTIALS,
		payload: {token, user}
	}
};


export const authenticate = (email, password) => {
	return dispatch => {
		return apiAuthentication(email, password)
			.then((data) => {
				console.log('Your data: ', data);
				
				return Promise.resolve(data);
			})
	};
};

export const fetchBlogPosts = () => {
	const blogService = getService('posts', 1);
	const params = {
	
	};
	return dispatch => {
		blogService.find(params).then(res => console.log('==>', res));
	};
};
