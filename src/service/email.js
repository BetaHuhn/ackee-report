const nodemailer = require('nodemailer')
const ejs = require('ejs')
const mjml = require('mjml')
const path = require('path')

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

	async render(data, endpoint, to) {
		// Prepare list items
		const listItems = [ 'pages', 'referrers', 'languages', 'browsers', 'devices', 'sizes', 'systems' ]
		const domains = data.domains.map((domain) => {
			// Filter domains
			const result = listItems
				.filter((item) => domain[item] === undefined || domain[item].length)
				.map((item) => {
					return {
						title: item.charAt(0).toUpperCase() + item.slice(1),
						data: domain[item]
					}
				})

			// Split domains into chunks
			const chunked = []
			for (let i = 0; i < result.length; i += 2) {
				chunked.push(result.slice(i, i + 2))
			}

			return {
				id: domain.id,
				title: domain.title,
				viewsInRange: domain.viewsInRange,
				viewsDay: domain.viewsDay,
				viewsMonth: domain.viewsMonth,
				viewsYear: domain.viewsYear,
				viewsAvg: domain.viewsAvg,
				durationAvg: domain.durationAvg,
				rows: chunked
			}
		})

		const events = []
		if (data.events !== undefined && data.events.length > 0) {
			const filteredEvents = data.events.filter((item) => item.data !== undefined && item.data.length > 0)

			// Split events into chunks
			if (filteredEvents.length > 0) {
				for (let i = 0; i < filteredEvents.length; i += 2) {
					events.push(filteredEvents.slice(i, i + 2))
				}
			}
		}

		// Render email with data
		const html = await ejs.renderFile(
			path.join(__dirname, `../templates/email.ejs`),
			{
				domains,
				events,
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

		// Generate final email
		const htmlOutput = mjml(html, { validationLevel: 'skip' })

		if (htmlOutput.errors.length > 0) {
			console.log(htmlOutput.errors)
			throw new Error(JSON.stringify(htmlOutput.errors))
		}

		return htmlOutput.html
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
		const html = await email.render(data, config.ackee.server, to)

		const subject = `Ackee report for ${ data.namesShort }`

		email.send(from, to, subject, html).then((info) => {
			resolve(info)
		})
	})
}

module.exports = report