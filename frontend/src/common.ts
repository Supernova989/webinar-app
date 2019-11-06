import jwt from 'jsonwebtoken';

export const TOKEN_VALUE_NAME = 'accessToken';
export const ROLE_USER = 1;
export const ROLE_ASSISTANT = 2;
export const ROLE_ADMIN = 3;
export const ACC_NAVBAR_MEETINGS = 10;
export const ACC_NAVBAR_BILLING = 20;
export const ACC_NAVBAR_NOTIFICATIONS = 30;
export const ACC_NAVBAR_ZOOM = 40;
export const ACC_NAVBAR_MANAGEMENT = 50;

export const API_GENERAL_ERROR_MESSAGE = 'An error occurred. Please try again later.';
export const API_ERROR_NAME_NOT_AUTHENTICATED = 'NotAuthenticated';
export const API_ERROR_BAD_REQUEST = 'BadRequest';

export const extractFromToken = (token: string, property: string) => {
	return jwt.decode(token)![property];
};
