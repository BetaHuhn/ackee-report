const nodemailer = require('nodemailer')
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

	build(domains, endpoint, to) {
		const total = domains.reduce((n, { facts }) => n + facts.viewsMonth, 0)
		const average = domains.reduce((n, { facts }) => n + facts.averageDuration, 0) / domains.length
		const head = `
			<h2>Ackee report</h2>
			<p>You've had ${ total } visitors in total 🎉! Each visitor stayed on you website for an average of ${ average } seconds. See below for a more detailed report of each domain:</p>

		`

		const domainData = (domain) => `
			<h2>${ domain.title }</h2>
			<p>Average views per day: ${ domain.facts.averageViews }</p>
			<p>Average duration: ${ domain.facts.averageDuration / 1000 } seconds</p>
			<p>Views this month: ${ domain.facts.viewsMonth }</p>
			<p>Top pages:</p>
			<ul>${ domain.statistics.pages.map((page) => `<li>${ page.id } - ${ page.count } visits</li>`) }</ul>
			<p>Top referrers:</p>
			<ul>${ domain.statistics.referrers.map((referrer) => `<li>${ referrer.id } - ${ referrer.count } visits</li>`).join('') }</ul>
		`

		const names = domains.map((domain) => domain.title).join(', ')
		const footer = `
			<br>
			<p>View all current statistics on <a href="${ endpoint }">${ endpoint }</a></p>
			<p>This report was generated at ${ new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') } for ${ names } and sent to ${ to }</p>
		`

		const html = `
			${ head }
			${ domains.map(domainData).join('') }
			${ footer }
		`

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

const report = async function(domains, to) {
	return new Promise((resolve) => {
		const config = loadConfig()

		const { host, port, username, password, from } = config.get('email')

		const email = new Email(host, port, username, password)
		const html = email.build(domains, config.get('ackee').server, to)

		const subject = `Ackee report for ${ domains.map((domain) => domain.title).join(', ') }`

		email.send(from, to, subject, html).then((info) => {
			resolve(info)
		})
	})
}

module.exports = report