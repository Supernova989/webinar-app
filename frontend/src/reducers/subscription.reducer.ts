import {
	SET_SUBSCRIPTION,
	CLEAR_SUBSCRIPTION
} from '../actions/types';
import {Action} from "redux";

interface Subscription {
	has_scheduled_cancellation?: boolean;
	scheduled_cancellation_date?: number;
	current_period_end?: number;
}

interface DefaultState extends Subscription{
	active: boolean;
}

const defaultState: DefaultState = {
	active: false,
	has_scheduled_cancellation: undefined,
	scheduled_cancellation_date: undefined,
	current_period_end: undefined
};

interface SubscriptionAction extends Action {
	payload: Subscription;
}

const reducer = (state = defaultState, action: SubscriptionAction) => {
	switch (action.type) {
		case SET_SUBSCRIPTION: {
			state = {
				...state,
				...action.payload,
				active: true,
			};
			break;
		}
		case CLEAR_SUBSCRIPTION: {
			state = {
				...state,
				active: false,
				has_scheduled_cancellation: undefined,
				scheduled_cancellation_date: undefined,
				current_period_end: undefined
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
