const Configstore = require('configstore')
const prompt = require('prompt-sync')({ sigint: true })
const packageJson = require('../package.json')

require('dotenv').config()

const config = new Configstore(packageJson.name, {})

const fields = [ 'ackee.server', 'email.host', 'email.port', 'email.username', 'email.password', 'email.from' ]

const getEnv = (key) => {
	const envKey = key.split('.').join('_').toUpperCase()
	return process.env[envKey]
}

const verifyField = (field) => {
	const existing = config.get(field)
	if (existing) return existing

	const env = getEnv(field)
	if (env !== undefined) {
		config.set(field, env)
		return
	}

	const text = field.split('.').join(' ')
	const required = !field.includes('email')
	const output = text + (required ? ' (required):' : ' (press enter to skip):')
	let value = prompt(output)
	if (value.length < 1 && required) {
		value = verifyField(field)
	}

	config.set(field, value)
	return value
}

const verifyAuth = () => {
	const envToken = getEnv('ackee.token')
	if (envToken !== undefined) {
		config.set('ackee.token', envToken)
		return
	}

	const configHasToken = config.get('ackee.token') !== undefined
	const configHasCreds = config.get('ackee.username') !== undefined && config.get('ackee.password') !== undefined

	if (configHasToken === false && configHasCreds === false) {
		const token = prompt('ackee token (press enter to skip): ')
		if (token.length < 1) {

			verifyField('ackee.username')
			verifyField('ackee.password')

		} else {
			config.set('ackee.token', token)
		}
	}
}

const loadConfig = function() {
	verifyAuth()

	fields.forEach((field) => {
		verifyField(field)
	})

	return config
}

module.exports.Config = config
module.exports.loadConfig = loadConfig