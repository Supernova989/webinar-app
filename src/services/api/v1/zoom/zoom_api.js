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
