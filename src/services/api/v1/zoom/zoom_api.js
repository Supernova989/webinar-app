const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const config = require('config');

class ZoomAPI {
	api_key = '';
	secret = '';
	headers = {};
	request = null;
	domain = 'https://api.zoom.us';
	
	constructor() {
		this.api_key = config.get('zoom').zoom_api_key;
		this.secret = config.get('zoom').zoom_api_secret;
		this.headers = {
			'User-Agent': 'Zoom-api-Jwt-Request',
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + this.getZoomJWT()
		};
	}
	
	/**
	 * @return {string}
	 */
	getZoomJWT() {
		const payload = {
			iss: this.api_key,
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 2 // = 2 years
		};
		return jwt.sign(payload, this.secret, {algorithm: 'HS256'});
	}
	
	/**
	 * Returns a list of active ZOOM meetings
	 *
	 * @return {Promise<Object>}
	 */
	get_upcoming_meetings() {
		const pageSize = 6;
		const url = `${this.domain}/v2/users/${config.get('zoom').zoom_host_id}/meetings?type=upcoming&page_size=${pageSize}`;
		return fetch(url, {method: 'GET', headers: this.headers}).then(res => res.json());
	}
	
	/**
	 * Get details of a meeting with the ID provided
	 *
	 * @param meeting_id {number} - Meeting ID
	 * @return {Promise<Object>}
	 */
	get_meeting_details(meeting_id) {
		const url = `${this.domain}/v2/meetings/${meeting_id}`;
		return fetch(url, {method: 'get', headers: this.headers}).then(res => res.json());
	}
	
	/**
	 * Add a registrant to a meeting with the ID provided
	 *
	 * @param meeting_id {number}
	 * @param first_name {string} - Registrant's first name
	 * @param email {string} - Registrant's email
	 * @param hash {string} - a 5 character long hash to identify the user
	 */
	add_registrant(meeting_id, email, first_name, hash) {
		const url = `${this.domain}/v2/meetings/${meeting_id}/registrants`;
		const body = JSON.stringify({
			email,
			first_name,
			last_name: hash
		});
		return fetch(url, {method: 'post', body, headers: this.headers}).then(res => res.json());
	}
	
	/**
	 * Get a list of users registered for a meeting with the ID provided
	 *
	 * @param meeting_id {number}
	 * @return {Promise<Object>}
	 */
	get_meeting_registrants(meeting_id) {
		const url = `${this.domain}/v2/meetings/${meeting_id}/registrants`;
		return fetch(url, {method: 'get', headers: this.headers}).then(res => res.json());
	}
	
	/**
	 *
	 * @param email
	 * @param first_name
	 * @param last_name
	 *
	 * @return {Promise<Object>}
	 */
	create_user(email, first_name, last_name) {
		const url = `${this.domain}/v2/users`;
		const body = JSON.stringify({
			action: 'create',
			user_info: {
				email,
				type: 1, // 1 - Basic plan
				first_name,
				last_name
			}
		});
		return fetch(url, {method: 'post', body, headers: this.headers}).then(res => res.json());
	}
	
	/**
	 * Lists Zoom users
	 *
	 * @param page {number}
	 * @param size {number}
	 * @param status {'active'|'pending'|'inactive'}
	 *
	 * @return {Promise<T>}
	 */
	get_users(page = 1, size = 300, status = 'active') {
		page = parseInt(page);
		page = page > 0 ? page : 1;
		const url = `${this.domain}/v2/users?page_size=${size}&page_number=${page}&status=${status}`;
		return fetch(url, {method: 'get', headers: this.headers}).then(res => res.json());
	}
	
	get_user(zoom_id) {
		const url = `${this.domain}/v2/users/${zoom_id}`;
		return fetch(url, {method: 'get', headers: this.headers}).then(res => res.json());
	}
	
	check_email(email) {
		if (!email) {
			throw Error('EMAIL is required');
		}
		const url = `${this.domain}/v2/users/email?email=${email}`;
		return fetch(url, {method: 'get', headers: this.headers}).then(res => res.json());
	}
	
	/**
	 * Activates/Deactivates user's status
	 *
	 * @param zoom_id - Zoom User ID
	 * @param status {boolean} - true = "activate", false = "deactivate"
	 *
	 * @return {Promise<null>}
	 */
	change_user_status(zoom_id, status) {
		const url = `${this.domain}/v2/users/${zoom_id}/status`;
		const action = status ? 'activate' : 'deactivate';
		const body = JSON.stringify({action});
		return fetch(url, {method: 'put', body, headers: this.headers});
	}
}

module.exports.ZoomAPI = ZoomAPI;
