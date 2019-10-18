import {
	LOG_IN,
	LOG_OUT
} from '../actions/types';

const defaultState = {
	token: localStorage.getItem('token')
};

const reducer = (state = defaultState, action) => {
	switch (action.type) {
		case LOG_OUT: {
			state = {...state, token: ''};
			localStorage.removeItem('token');
		}
	}
	
	return state;
};

export default reducer;
