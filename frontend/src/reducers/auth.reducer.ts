import {
	LOG_IN,
	SET_CREDENTIALS,
	LOG_OUT
} from '../actions/types';
import { TOKEN_VALUE_NAME } from "../common";
import {Action} from 'redux';
import jwt from 'jsonwebtoken';

export interface User {
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	role: number;
}

interface DefaultState {
	token: string | null;
	exp: number | null;
	user: User | null;
}

const defaultState: DefaultState = {
	token: localStorage.getItem(TOKEN_VALUE_NAME),
	exp: null,
	user: null
};

interface AuthAction extends Action {
	payload: {
		token: string,
		user: User
	}
}

const reducer = (state = defaultState, action: AuthAction) => {
	switch (action.type) {
		case SET_CREDENTIALS: {
			state = {
				...state,
				token: action.payload.token,
				exp: jwt.decode(action.payload.token).exp * 1000,
				user: action.payload.user
			};
			localStorage.setItem(TOKEN_VALUE_NAME, <string>state.token);
			break;
		}
		case LOG_OUT: {
			state = {...state, token: null, exp: null, user: null};
			localStorage.removeItem(TOKEN_VALUE_NAME);
			break;
		}
	}
	
	return state;
};

export default reducer;

