import {
	SET_ERROR
} from '../actions/types';
import {Action} from "redux";
import {TOKEN_VALUE_NAME} from "../common";

const defaultState = {

};

const reducer = (state = defaultState, action: Action) => {
	switch (action.type) {
		case SET_ERROR: {
		
		}
	}
	
	return state;
};

export default reducer;
