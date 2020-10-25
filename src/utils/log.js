const { Signale } = require('signale')

module.exports = new Signale({
	logLevel: process.env.LOG_LEVEL || 'info',
	types: {
		success: {
			badge: '✔',
			color: 'green',
			label: 'success',
			logLevel: 'debug'
		},
		info: {
			badge: 'ℹ️',
			color: 'blue',
			label: 'info',
			logLevel: 'debug'
		},
		debug: {
			badge: '🐛',
			color: 'cyan',
			label: 'debug',
			logLevel: 'info'
		}
	}
})