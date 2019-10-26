import jwt from 'jsonwebtoken';

export const TOKEN_VALUE_NAME = 'accessToken';
export const API_GENERAL_ERROR_MESSAGE = 'An error occurred. Please try again later.';
export const API_ERROR_NAME_NOT_AUTHENTICATED = 'NotAuthenticated';
export const API_ERROR_BAD_REQUEST = 'BadRequest';

export const extractFromToken = (token: string, property: string) => {
	return jwt.decode(token)![property];
};
