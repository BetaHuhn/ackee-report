const ora = require('ora')

const Ackee = require('./Interface')
const { loadConfig } = require('./Config')
const Report = require('./service')
const Constants = require('./Constants')

class Runner {
	constructor(args) {
		this.args = args || []
		this.config = loadConfig()
	}

	async getData() {
		const { domain, id, range, limit, events } = this.args

		const spinner = ora()
		this.spinner = spinner

		try {
			// Exit if either domain and id is missing
			if (id === undefined && domain === undefined) throw new Error(' error: no domain specified')

			// Check if data range option is specified and valid
			const dataRange = Constants.range[range]
			if (range === undefined) throw new Error(` error: range '${ range }' not supported`)

			// Check if events option is specified and valid
			const eventsValue = Constants.eventType[events]
			if (typeof events === 'string' && eventsValue === undefined) throw new Error(` error: event type '${ events }' not supported`)

			// Create new ackee instance
			spinner.start('Getting Ackee token from server...')
			const ackee = new Ackee({
				range: dataRange,
				limit: limit,
				events: typeof events === 'string' ? true : events,
				eventType: eventsValue || Constants.eventType.total
			})

			// Use authentication specified in config to login to ackee
			await ackee.login()
			spinner.text = 'Login successfull'

			// If domain title are specifed get the corresponding id
			let domains = id
			if (domain !== undefined) {
				spinner.text = 'Getting domains by title...'

				domains = await ackee.getDomains()

				if (domain[0] !== 'all') {
					domains = domains.filter((aDomain) => domain.includes(aDomain.title))
				}

				domains = domains.map((aDomain) => aDomain.id)
			}

			if (domains.length < 1) throw new Error(' error: no domains found')

			// Get the actual data via Ackee's GraphQL API
			spinner.text = 'Getting data...'
			const data = await ackee.get(domains)

			return data

		} catch (err) {
			if (err.message) {
				spinner.fail(` ${ err.message }`)
				return undefined
			}

			spinner.fail(' error: see below for more details')
			console.log(err)

			return undefined
		}
	}

	async email(data) {
		const { to } = this.args
		const spinner = this.spinner

		try {
			if (to === undefined) throw new Error(' error: no email recipient specified')

			spinner.text = `Generating email...`
			await Report.email(data, this.config.all, to)

			return spinner.succeed(` Report sent to: ${ to.join(', ') }`)
		} catch (err) {
			if (err.message) {
				spinner.fail(` ${ err.message }`)
				return undefined
			}

			spinner.fail(' error: see below for more details')
			console.log(err)

			return undefined
		}
	}

	async html(data) {
		const { output } = this.args
		const spinner = this.spinner

		try {
			if (output === undefined) throw new Error(' error: no output path specified')

			spinner.text = 'Generating html...'
			await Report.html(data, this.config.all, output)

			return spinner.succeed(` Report saved to ${ output }`)
		} catch (err) {
			if (err.message) {
				spinner.fail(` ${ err.message }`)
				return undefined
			}

			spinner.fail(' error: see below for more details')
			console.log(err)

			return undefined
		}
	}

	async json(data) {
		const { output } = this.args
		const spinner = this.spinner

		try {
			if (output === undefined) throw new Error(' error: no output path specified')

			spinner.text = 'Generating json...'
			await Report.json(data, this.config.all, output)

			return spinner.succeed(` Report saved to ${ output }`)
		} catch (err) {
			if (err.message) {
				spinner.fail(` ${ err.message }`)
				return undefined
			}

			spinner.fail(' error: see below for more details')
			console.log(err)

			return undefined
		}
	}

	async rss(data) {
		const { output } = this.args
		const spinner = this.spinner

		try {
			if (output === undefined) throw new Error(' error: no output path specified')

			spinner.text = 'Generating rss feed...'
			await Report.rss(data, this.config.all, output)

			return spinner.succeed(` Report saved to ${ output }`)
		} catch (err) {
			if (err.message) {
				spinner.fail(` ${ err.message }`)
				return undefined
			}

			spinner.fail(' error: see below for more details')
			console.log(err)

			return undefined
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