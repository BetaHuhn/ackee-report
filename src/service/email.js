const nodemailer = require('nodemailer')

const render = require('./helpers/renderHtml')

class Email {
	constructor(host, port, username, password) {
		const transporter = nodemailer.createTransport({
			host: host,
			port: port,
			// Only start secure connection for port 465, for other ports use STARTTLS - reference: https://git.io/JqZPR
			secure: port === '465',
			auth: {
				user: username,
				pass: password
			}
		})

		this.transporter = transporter
	}

	send(from, to, subject, html) {
		return new Promise((resolve, reject) => {
			const mailOptions = {
				from: from,
				to: to,
				subject: subject,
				html: html
			}

			this.transporter.sendMail(mailOptions, function(err, info) {
				if (err) {
					reject(err)
				}

				resolve(info)
			})
		})
	}
}

const report = async function(data, config, to) {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve) => {

		const { host, port, username, password, from } = config.email
		const email = new Email(host, port, username, password)

		const html = await render(data, config.ackee.server, to)

		const subject = `Ackee report for ${ data.namesShort }`
		email.send(from, to, subject, html).then((info) => {
			resolve(info)
		})
	})
}

module.exports = report