const Configstore = require('configstore')
const prompt = require('prompt-sync')({ sigint: false })
const packageJson = require('../package.json')

const config = new Configstore(packageJson.name, {})

const loadConfig = function() {
	if (!config.get('ackee.server')) {
		const server = prompt('Ackee server: ')
		config.set('ackee.server', server)
	}

	if (!config.get('ackee.username')) {
		const username = prompt('Ackee username: ')
		config.set('ackee.username', username)
	}

	if (!config.get('ackee.password')) {
		const password = prompt('Ackee password: ')
		config.set('ackee.password', password)
	}

	if (!config.get('email.host')) {
		const host = prompt('SMTP host: ')
		config.set('email.host', host)
	}

	if (!config.get('email.username')) {
		const username = prompt('SMTP username: ')
		config.set('email.username', username)
	}

	if (!config.get('email.password')) {
		const password = prompt('SMTP password: ')
		config.set('email.password', password)
	}

	if (!config.get('email.from')) {
		const from = prompt('SMTP from field: ')
		config.set('email.from', from)
	}

	/* Defaults, can only be changed in config file */
	if (!config.get('email.port')) {
		config.set('email.port', 465)
	}

	return config
}

module.exports = loadConfig