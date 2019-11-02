import {
	LOGIN_FETCH_START,
	LOGIN_FETCH_FULFILLED,
	SET_CREDENTIALS,
	LOG_OUT
} from '../actions/types';
import { TOKEN_VALUE_NAME } from "../common";
import {Action} from 'redux';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import {extractFromToken} from "../common";


let token = localStorage.getItem(TOKEN_VALUE_NAME);
if (token && jwt.decode(token)) {
	axios.defaults.headers['Authorization'] = 'Bearer ' + token;
} else {
	token = null;
}

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
	isFetching: boolean;
}

const defaultState: DefaultState = {
	token: token,
	exp: null,
	user: null,
	isFetching: false
};



if (defaultState.token) {
	defaultState.exp = extractFromToken(defaultState.token, 'exp');
	defaultState.user = {
		username: extractFromToken(defaultState.token, 'username'),
		email: extractFromToken(defaultState.token, 'email'),
		role: extractFromToken(defaultState.token, 'role'),
		firstName: extractFromToken(defaultState.token, 'firstName'),
		lastName: extractFromToken(defaultState.token, 'lastName'),
	};
	
}

interface AuthAction extends Action {
	payload: {
		token: string,
		user: User
	}
}

console.log('USING TOKEN', axios.defaults.headers['Authorization']);
const reducer = (state = defaultState, action: AuthAction) => {
	switch (action.type) {
		case SET_CREDENTIALS: {
			console.log('FROM PAYLOAD', action.payload.user);
			state = {
				...state,
				token: action.payload.token,
				exp: extractFromToken(action.payload.token, 'exp') * 1000,
				user: action.payload.user
			};
			axios.defaults.headers['Authorization'] = 'Bearer ' + <string>state.token;
			console.log('SETTING TOKEN', axios.defaults.headers['Authorization']);
			localStorage.setItem(TOKEN_VALUE_NAME, <string>state.token);
			break;
		}
		case LOG_OUT: {
			state = {...state, token: null, exp: null, user: null};
			delete axios.defaults.headers.Authorization;
			localStorage.removeItem(TOKEN_VALUE_NAME);
			break;
		}
		case LOGIN_FETCH_START: {
			state = {...state, isFetching: true};
			break;
		}
		case LOGIN_FETCH_FULFILLED: {
			state = {...state, isFetching: false};
			break;
		}
	}
	
	return state;
};

export default reducer;

