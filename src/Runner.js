const Ackee = require('./Interface')
const ora = require('ora')
const loadConfig = require('./Config')
const Report = require('./service')

class Runner {
	constructor(args, options) {
		const config = loadConfig()
		this.config = config.all
		this.path = config.path
		this.options = options || {}
		this.args = args || []
	}

	async report() {
		const { domain, id, service, to, output } = this.args
		const config = this.config

		const spinner = ora(`Getting Ackee token from server...`).start()

		try {
			const ackee = new Ackee(config.ackee.server, config.ackee.username, config.ackee.password)
			await ackee.login()

			spinner.text = 'Login successfull'

			let domains = id
			if (domain !== undefined) {
				spinner.text = 'Getting domains by title...'

				domains = await ackee.getDomains()

				if (domain[0] !== 'all') {
					domains = domains.filter((aDomain) => domain.includes(aDomain.title))
				}

				domains = domains.map((aDomain) => aDomain.id)
			}

			if (domains.length < 1) {
				return spinner.fail(' error: no domains found')
			}

			spinner.text = 'Getting data...'
			const data = await ackee.get(domains)

			if (service === 'email') {
				if (!to) return spinner.fail(' error: no recipient specified with --to')

				spinner.text = 'Generating email...'
				await Report.email(data, to)

				return spinner.succeed(` Report sent to: ${ to.join(', ') }`)
			} else if (service === 'json') {
				if (!output) return spinner.fail(' error: no output path specified with --output')

				spinner.text = 'Generating json...'
				await Report.json(data, output)

				return spinner.succeed(` Report saved to ${ output }`)
			}

			return spinner.fail(' error: service not found specified')

		} catch (err) {
			console.log(err)
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

			let domains = await ackee.getDomains()

			if (args.length > 0) {
				domains = domains.filter((domain) => args.includes(domain.title))
			}

			if (domains.length < 1) {
				return spinner.fail(' error: no domains found')
			}

			spinner.stop()

			domains.forEach((domain) => console.log(`${ domain.title }: ${ domain.id }`))

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