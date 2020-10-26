const Ackee = require('./Interface')
const ora = require('ora')
const loadConfig = require('./Config')
const emailReport = require('./service/email')

class Runner {
	constructor(args, options) {
		const config = loadConfig()
		this.config = config.all
		this.path = config.path
		this.options = options || {}
		this.args = args || []
	}

	async report() {
		const { service, to, ids } = this.options

		if (service === 'email') {
			const config = this.config

			const domainArg = this.args
			const spinner = ora(`Starting ackee-report...`).start()

			try {

				spinner.text = 'Logging in to Ackee server...'
				const ackee = new Ackee(config.ackee.server, config.ackee.username, config.ackee.password)
				await ackee.login()

				spinner.text = 'Login successfull'

				let domains = ids
				if (domains === undefined) {
					if (domainArg === undefined) {
						return console.error('error: no domains specified')
					}

					domains = await ackee.domains()
					domains = domains.filter((domain) => {
						return domainArg.includes(domain.title)
					})
				}

				const getData = async () => {
					return Promise.all(domains.map((id) => ackee.domain(id)))
				}

				const data = await getData()

				await emailReport(data, to, 'monthly')

				spinner.succeed(` Report sent to: ${ to }`)

			} catch (err) {
				console.log(err)
			}
		}
	}

	async domains() {
		const config = this.config

		const args = this.args

		const spinner = ora(`Starting ackee-report...`).start()

		try {

			spinner.text = 'Logging in to Ackee server...'
			const ackee = new Ackee(config.ackee.server, config.ackee.username, config.ackee.password)
			await ackee.login()

			spinner.text = 'Login successfull, getting domains...'

			let domains = await ackee.domains()

			if (args.length > 0) {
				domains = domains.filter((domain) => {
					return args.includes(domain.title)
				})
			}

			spinner.stop()

			domains.forEach((domain) => {
				console.log(`${ domain.title }: ${ domain.id }`)
			})

		} catch (err) {
			console.log(err)
		}
	}

	outputConfig() {
		console.log(`Config stored at: ${ this.path }`)
		console.log(this.config)
	}
}

module.exports = Runner