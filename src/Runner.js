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
		const { domain, id, service, to } = this.args
		const config = this.config

		const spinner = ora(`Getting Ackee token from server...`).start()

		try {
			const ackee = new Ackee(config.ackee.server, config.ackee.username, config.ackee.password)
			await ackee.login()

			spinner.text = 'Login successfull'

			let domains = id
			if (domain !== undefined) {
				spinner.text = 'Getting domains by title...'

				domains = await ackee.domains()

				domains = domains.filter((aDomain) => domain.includes(aDomain.title))
				domains = domains.map((aDomain) => aDomain.id)
			}

			if (domains.length < 1) {
				return spinner.fail(' error: no domains found')
			}

			const getData = async () => Promise.all(domains.map((id) => ackee.domain(id)))

			spinner.text = 'Getting domain data...'
			const data = await getData()

			if (service === 'email') {
				if (!to) return spinner.fail(' error: no recipient specified with --to')

				spinner.text = 'Generating report...'
				await emailReport(data, to)

				return spinner.succeed(` Report sent to: ${ to.join(', ') }`)
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

			let domains = await ackee.domains()

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