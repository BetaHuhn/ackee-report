const Ackee = require('./Interface')
const ora = require('ora')
const { loadConfig } = require('./Config')
const Report = require('./service')
const Constants = require('./Constants')

class Runner {
	constructor(args) {
		this.args = args || []
		this.config = loadConfig()
	}

	async email() {
		const { domain, id, to, style, range, limit } = this.args

		const spinner = ora()

		if (!id && !domain) return spinner.fail(' error: no domain specified')
		if (!Constants.style.includes(style)) return spinner.fail(' error: style not supported')

		const dataRange = Constants.range[range]
		if (!dataRange) return spinner.fail(' error: range not supported')

		spinner.start('Getting Ackee token from server...')

		try {
			const ackee = new Ackee({
				range: dataRange,
				limit: limit
			})
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

			if (!to) return spinner.fail(' error: no recipient specified with --to')

			spinner.text = `Generating email with ${ style } style...`
			await Report.email(data, this.config.all, { to, style })

			return spinner.succeed(` Report sent to: ${ to.join(', ') }`)
		} catch (err) {
			if (err.message) {
				return spinner.fail(` ${ err.message }`)
			}
			spinner.fail(' error: see below for more details')
			console.log(err)
		}
	}

	async json() {
		const { domain, id, output, range, limit } = this.args

		const spinner = ora()

		if (!id && !domain) return spinner.fail(' error: no domain specified')

		const dataRange = Constants.range[range]
		if (!dataRange) return spinner.fail(' error: range not supported')

		spinner.start('Getting Ackee token from server...')

		try {
			const ackee = new Ackee({
				range: dataRange,
				limit: limit
			})
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

			if (!output) return spinner.fail(' error: no output path specified with --output')

			spinner.text = 'Generating json...'
			await Report.json(data, this.config.all, output)

			return spinner.succeed(` Report saved to ${ output }`)
		} catch (err) {
			if (err.message) {
				return spinner.fail(` ${ err.message }`)
			}
			spinner.fail(' error: see below for more details')
			console.log(err)
		}
	}

	async rss() {
		const { domain, id, output } = this.args

		if (!id && !domain) return ora(' error: no domain specified').fail()

		const spinner = ora(`Getting Ackee token from server...`).start()

		try {
			const ackee = new Ackee()
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

			if (!output) return spinner.fail(' error: no output path specified with --output')

			spinner.text = 'Generating rss feed...'
			await Report.rss(data, this.config.all, output)

			return spinner.succeed(` Report saved to ${ output }`)
		} catch (err) {
			if (err.message) {
				return spinner.fail(` ${ err.message }`)
			}
			spinner.fail(' error: see below for more details')
			console.log(err)
		}
	}

	async domains() {
		const args = this.args
		const spinner = ora(`Starting ackee-report...`).start()

		try {

			spinner.text = 'Logging in to Ackee server...'
			const ackee = new Ackee()
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
			if (err.message) {
				return spinner.fail(` ${ err.message }`)
			}
			spinner.fail(' error: see below for more details')
			console.log(err)
		}
	}

	outputConfig() {
		const config = this.config
		console.log(`Config stored at: ${ config.path }`)
		console.log(config.all)
	}
}

module.exports = Runner