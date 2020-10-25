const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const defaultConfig = {
	username: '',
	password: '',
	reports: []
}

const loadConfig = function() {
	const adapter = new FileSync('src/config.json')
	const db = low(adapter)
	db.defaults(defaultConfig).write()

	return db
}

module.exports = loadConfig