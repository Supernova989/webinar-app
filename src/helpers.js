const S3 = require('aws-sdk/clients/s3');

/**
 * Logs a message about an error or event
 * @param message
 * @param obj
 * @param upload {boolean} - Whether to upload to AWS
 * @param type{'ERROR'|'WARNING'|'INFO'}
 */
function log_report(message, obj, upload, type = 'ERROR') {
	let txt = `${type} - ${new Date().toLocaleDateString()} - ${message}. `;
	console.log(txt);
	if (obj) {
		console.log(obj);
		txt += obj;
	}
	if (upload) {
	
	}
}


module.exports = {
	log_report,
};
