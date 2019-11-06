import {
	LOG_OUT,
	SET_CREDENTIALS,
	LOGIN_FETCH_START,
	FETCH_MEETINGS,
	SET_SUBSCRIPTION_FETCH_DATE,
	SUBSCRIPTION_FETCH_START,
	SUBSCRIPTION_FETCH_FULFILLED,
	LOGIN_FETCH_FULFILLED,
	SET_SUBSCRIPTION,
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

export const set_meetings = (meetings) => {
	return {
		type: FETCH_MEETINGS,
		payload: meetings
	}
};

export const fetch_meetings = () => {
	const zoomService = getService('zoom', 1);
	return dispatch => {
		return zoomService.get('meetings')
			.then((meetings) => {
				dispatch(set_meetings(meetings));
			});
	}
};

export const order_subscription = () => {
	const stripeService = getService('stripe', 1);
	return dispatch => {
		return stripeService.create({q: 'new'},).then((response) => {
			const {public_key, session_token} = response;
			dispatch(subscription_fetch_change(true));
			const stripe = window.Stripe(public_key);
			stripe.redirectToCheckout({sessionId: session_token})
				.then(({error}) => {
					console.log('Stripe error! ', error.message);
				});
		});
	}
};

export const set_subscription = (info) => {
	return {
		type: SET_SUBSCRIPTION,
		payload: info
	}
};

export const subscription_fetch_change = (status) => {
	return {
		type: status ? SUBSCRIPTION_FETCH_START : SUBSCRIPTION_FETCH_FULFILLED
	}
};

export const set_subscription_fetch_date = () => {
	return {
		type: SET_SUBSCRIPTION_FETCH_DATE
	}
};

export const change_subscription_status = (status) => {
	const stripeService = getService('stripe', 1);
	const q = status ? 'renew' : 'cancel';
	return dispatch => {
		dispatch(subscription_fetch_change(true));
		return stripeService.create({q})
			.then((response) => {
				console.log('response', response);
			})
			.catch((err) => {
			
			})
			.finally(() => {
				dispatch(subscription_fetch_change(false));
			});
	}
};

export const fetchSubscriptionInfo = () => {
	const stripeService = getService('stripe', 1);
	return dispatch => {
		dispatch(subscription_fetch_change(true));
		return stripeService.find()
			.then((response) => {
				dispatch(set_subscription_fetch_date());
				dispatch(set_subscription(response));
			})
			.catch((err) => {
			})
			.finally(() => {
				dispatch(subscription_fetch_change(false));
			});
	};
};


export const fetchBlogPosts = () => {
	const blogService = getService('posts', 1);
	const params = {};
	return dispatch => {
		blogService.find(params).then(res => console.log('==>', res));
	};
};
