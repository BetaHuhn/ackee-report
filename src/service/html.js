const fs = require('fs')

const render = require('./helpers/renderHtml')

const report = async function(data, config, output) {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		const html = await render(data, config.ackee.server, 'html')

		fs.writeFile(output, html, (err) => {
			if (err) reject(err)
			resolve()
		})
	})
}

module.exports = report