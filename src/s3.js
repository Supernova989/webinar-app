const AWS = require('aws-sdk');
const config = require('config');

const s3 = new AWS.S3({
	accessKeyId: config.get('AWS').S3.access_key_id,
	secretAccessKey: config.get('AWS').S3.secret
});

module.exports = s3;
