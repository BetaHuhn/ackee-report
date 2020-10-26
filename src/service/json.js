const fs = require('fs')

const report = async function(domains, output) {
	return new Promise((resolve, reject) => {
		const data = JSON.stringify(domains, null, 2)

		fs.writeFile(output, data, (err) => {
			if (err) reject(err)
			resolve()
		})
	})
}

module.exports = report