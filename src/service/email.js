const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')

class Email {
	constructor(host, port, username, password) {
		const transporter = nodemailer.createTransport({
			host: host,
			port: port,
			secure: true,
			auth: {
				user: username,
				pass: password
			}
		})

		this.transporter = transporter
	}

	async html(data, endpoint, to, style) {
		const html = await ejs.renderFile(
			path.join(__dirname, `../templates/${ style }.ejs`),
			{
				domains: data.domains,
				events: data.events,
				viewsInRange: data.viewsInRange,
				viewsYear: data.viewsYear,
				viewsAvg: data.viewsAvg,
				durationAvg: data.durationAvg,
				names: data.names,
				namesShort: data.namesShort,
				generatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
				range: data.range,
				endpoint,
				to
			}
		)

		return html
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

const report = async function(data, config, param) {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve) => {

		const { host, port, username, password, from } = config.email

		const email = new Email(host, port, username, password)
		const html = await email.html(data, config.ackee.server, param.to, param.style)

		const subject = `Ackee report for ${ data.namesShort }`

		email.send(from, param.to, subject, html).then((info) => {
			resolve(info)
		})
	})
}

module.exports = report