import {combineReducers} from 'redux';
import authReducer from './auth.reducer';
import blogReducer from './blog.reducer';
import meetingReducer from './meeting.reducer';

export default combineReducers({
	auth: authReducer,
	blog: blogReducer,
	meeting: meetingReducer
});

/*

import {

} from '../actions/types';
import {Action} from "redux";

const defaultState = {

};

const reducer = (state = defaultState, action: Action) => {
	switch (action.type) {
		case '': {
		
		}
	}
	
	return state;
};

export default reducer;


*/
