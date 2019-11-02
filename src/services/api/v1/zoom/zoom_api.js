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
}

module.exports.ZoomAPI = ZoomAPI;
