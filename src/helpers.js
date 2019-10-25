const nodemailer = require('nodemailer');
const config = require('config');
const s3 = require('./s3');


/**
 * Logs a message about an error or event. Optionally upload the message to S3.
 * @param message
 * @param obj
 * @param type{'ERROR'|'WARNING'|'INFO'}
 * @param upload {boolean} - Whether to upload to AWS
 */
function log_msg(message, obj, type = 'INFO', upload = false) {
	let txt = `${type} - ${new Date().toLocaleDateString()} - ${message}. ` + '\n';
	console.log(txt);
	if (obj) {
		console.log(JSON.stringify(obj));
		txt += obj;
	}
	if (upload) {
		const d = new Date();
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		const putParams = {
			Body: new Buffer.from(txt).toString("utf8"),
			Bucket: config.get('AWS').S3.bucket,
			Key: `logs_${d.getFullYear()}/${months[d.getMonth()]}/${d.getDate()}/${type}_${new Date().toLocaleTimeString()}_${Date.now()}.log`,
		};
		s3.putObject(putParams, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else {
				console.log(data);           // successful response
			}
		});
	}
}

async function send_email(send_to, subject, html = defaultHTML, from = '"Admin" <no-reply@postflow.maximdev.com>') {
	let user, pass, port, host, secure;
	const PRODUCTION = process.env.NODE_ENV === 'production';
	const to = Array.isArray(send_to) ? send_to.join(', ') : send_to;
	if (PRODUCTION) {
		user = config.get('email').host_user;
		pass = config.get('email').host_password;
		port = config.get('email').port;
		host = config.get('email').host;
		secure = config.get('email').use_tls;
	} else {
		const account = await nodemailer.createTestAccount();
		user = account.user;
		pass = account.pass;
		port = 587;
		host = 'smtp.ethereal.email';
		secure = false;
	}
	const transporter = nodemailer.createTransport({
		host,
		port,
		secure,
		auth: {
			user,
			pass
		}
	});
	const mailOptions = {from, to, subject, html};
	
	const info = await transporter.sendMail(mailOptions);
	if (!PRODUCTION) {
		// debug messages
		console.log('Message sent: %s', info.messageId);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	}
}


module.exports = {
	log_msg: log_msg,
	send_email
};
