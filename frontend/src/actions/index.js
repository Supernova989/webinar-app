import {
	LOG_OUT,
	SET_CREDENTIALS,
	LOGIN_FETCH_START,
	LOGIN_FETCH_FULFILLED
} from "./types";
import { apiAuthentication, getService } from "../feathers-rest";

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
		dispatch({type: LOGIN_FETCH_START});
		return apiAuthentication(email, password)
			.then((data) => {
				return Promise.resolve(data);
			})
	};
};

/**
 *
 * @param username {string}
 * @param email {string}
 * @param password {string}
 * @param confirm {string}
 * @param firstName {string}
 * @param lastName {string}
 * @return {Promise}
 */
export const register_user = (username, email, password, confirm, firstName, lastName) => {
	const userService = getService('users', 1);
	const params = {username, email, password, confirm, firstName, lastName};
	return dispatch => {
		dispatch({type: LOGIN_FETCH_START});
		return userService.create(params)
			.then((data) => {
				return Promise.resolve(data);
			});
	}
};

export const fetchBlogPosts = () => {
	const blogService = getService('posts', 1);
	const params = {};
	return dispatch => {
		blogService.find(params).then(res => console.log('==>', res));
	};
};
