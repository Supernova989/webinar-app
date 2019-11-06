import {
	SET_SUBSCRIPTION,
	SET_SUBSCRIPTION_FETCH_DATE,
	CLEAR_SUBSCRIPTION,
	SUBSCRIPTION_FETCH_START,
	SUBSCRIPTION_FETCH_FULFILLED
} from '../actions/types';
import {Action} from "redux";
import moment, {Moment} from "moment";

interface Subscription {
	has_scheduled_cancellation?: boolean;
	scheduled_cancellation_date?: number;
	current_period_end?: number;
}

interface DefaultState extends Subscription {
	active: boolean;
	isFetching: boolean;
	lastFetch: Moment | null
}

const defaultState: DefaultState = {
	isFetching: false,
	active: false,
	lastFetch: null
};

interface SubscriptionAction extends Action {
	payload: {
		active?: boolean,
		has_scheduled_cancellation?: boolean,
		scheduled_cancellation_date?: number,
		current_period_end?: number
	}
}

const reducer = (state = defaultState, action: SubscriptionAction) => {
	switch (action.type) {
		case SET_SUBSCRIPTION: {
			state = {
				...state,
				...action.payload
			};
			console.log('SUB:', state);
			break;
		}
		case SET_SUBSCRIPTION_FETCH_DATE: {
			state = {
				...state,
				lastFetch: moment()
			};
			break;
		}
		case SUBSCRIPTION_FETCH_START: {
			state = {
				...state,
				isFetching: true
			};
			break;
		}
		case SUBSCRIPTION_FETCH_FULFILLED: {
			state = {
				...state,
				isFetching: false
			};
			break;
		}
		case CLEAR_SUBSCRIPTION: {
			state = {
				...state,
				active: false
			};
			break;
		}
		default: {
			break;
		}
	}
	
	return state;
};

export default reducer;
