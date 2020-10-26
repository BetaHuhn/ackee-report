const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')
const loadConfig = require('../Config')

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

	async html(data, endpoint, to) {
		const generatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

		const html = await ejs.renderFile(path.join(__dirname, '../templates/ackee.ejs'), { domains: data.domains, total: data.views, durationAvg: data.durationAvg, names: data.names, namesShort: data.namesShort, endpoint, to, generatedAt })

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

const report = async function(data, to) {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve) => {
		const config = loadConfig()

		const { host, port, username, password, from } = config.get('email')

		const email = new Email(host, port, username, password)
		const html = await email.html(data, config.get('ackee').server, to)

		const subject = `Ackee report for ${ data.namesShort }`

		email.send(from, to, subject, html).then((info) => {
			resolve(info)
		})
	})
}

module.exports = report