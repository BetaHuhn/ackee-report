const fs = require('fs')
const { Feed } = require('feed')

const items = [ 'pages', 'referrers', 'languages', 'browsers', 'devices', 'sizes', 'systems' ]

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

const report = async function(data, config, output) {
	return new Promise((resolve, reject) => {
		const feed = new Feed({
			title: 'Ackee Report',
			description: `Here is your ${ data.range.interval } report for ${ data.namesShort }`,
			id: config.ackee.server,
			link: config.ackee.server,
			language: 'en',
			favicon: `${ config.ackee.server }/favicon.ico`,
			generator: 'ackee-report'
		})

		data.domains.forEach((domain) => {
			let content = `<p><b>Total views/${ data.range.name }</b></p><p>${ domain.viewsInRange }</p><p><b>Average views/day</b></p><p>${ domain.viewsAvg }</p><p><b>Average duration</b></p><p>${ domain.durationAvg }s</p>`

			for (const idx in items) {
				const field = domain[items[idx]]
				if (field === undefined || field.length < 1) break

				let list = `<p><b>Top ${ capitalize(items[idx]) }</b></p>`
				field.forEach((item) => {
					if (item.id.startsWith('http')) {
						list += (`<p>${ item.count }x - <a href="${ item.id }">${ item.id }</a></p>`)
					} else {
						list += (`<p>${ item.count }x - ${ item.id }</p>`)
					}
				})

				content += list
			}

			feed.addItem({
				title: domain.title,
				description: content,
				link: config.ackee.server,
				date: new Date()
			})
		})

		if (data.events !== undefined && data.events.length > 0) {
			data.events.forEach((event) => {
				let content = ''

				event.data.forEach((item) => {
					content += `<p>${ item.count }x - ${ item.id }</p>`
				})

				feed.addItem({
					title: `Event: ${ event.title }`,
					description: content,
					link: config.ackee.server,
					date: new Date()
				})
			})
		}

		const result = feed.rss2()

		fs.writeFile(output, result, (err) => {
			if (err) reject(err)
			resolve()
		})
	})
}

module.exports = report