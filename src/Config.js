const Configstore = require('configstore')
const prompt = require('prompt-sync')({ sigint: true })
const packageJson = require('../package.json')

const config = new Configstore(packageJson.name, {})

const fields = [ 'ackee.server', 'email.host', 'email.port', 'email.username', 'email.password', 'email.from' ]

const verifyField = (field) => {
	const existing = config.get(field)
	if (existing) return existing

	const text = field.split('.').join(' ')
	let value = prompt(`${ text }: `)
	if (value.length < 1) {
		value = verifyField(field)
	}

	config.set(field, value)
	return value
}

const loadConfig = function() {
	if (!(config.get('ackee.token') || (config.get('ackee.username') && config.get('ackee.password')))) {

		const token = prompt('Ackee token (press enter to skip): ')
		if (token.length < 1) {

			verifyField('ackee.username')
			verifyField('ackee.password')

		} else {
			config.set('ackee.token', token)
		}

	}

	fields.forEach((field) => {
		verifyField(field)
	})

	return config
}

module.exports.Config = config
module.exports.loadConfig = loadConfig