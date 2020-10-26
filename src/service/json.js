const fs = require('fs')

const report = async function(data, output) {
	return new Promise((resolve, reject) => {
		const result = JSON.stringify(data, null, 2)

		fs.writeFile(output, result, (err) => {
			if (err) reject(err)
			resolve()
		})
	})
}

module.exports = report