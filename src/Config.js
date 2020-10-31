const Configstore = require('configstore')
const prompt = require('prompt-sync')({ sigint: false })
const packageJson = require('../package.json')

const config = new Configstore(packageJson.name, {})

const loadConfig = function() {
	if (!config.get('ackee.server')) {
		const server = prompt('Ackee server: ')
		config.set('ackee.server', server)
	}

	if (!config.get('ackee.token')) {
		const token = prompt('Ackee token (press enter to skip): ')
		if (token.length < 1) {
			if (!config.get('ackee.username')) {
				const username = prompt('Ackee username: ')
				config.set('ackee.username', username)
			}

			if (!config.get('ackee.password')) {
				const password = prompt('Ackee password: ')
				config.set('ackee.password', password)
			}
		} else {
			config.set('ackee.token', token)
		}
	}

	if (!config.get('email.host')) {
		const host = prompt('SMTP host: ')
		config.set('email.host', host)
	}

	if (!config.get('email.port')) {
		const port = prompt('SMTP port: ')
		config.set('email.port', port)
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

	return config
}

module.exports = loadConfig