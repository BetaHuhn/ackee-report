const loadConfig = require('./utils/config')
const log = require('./utils/log')
const Ackee = require('./api')
const emailReport = require('./service/email')

const config = loadConfig()

log.info(config.value())

const run = async function() {
	const { server, username, password } = config.get('ackee').value()

	const ackee = new Ackee(server, username, password)
	await ackee.login()

	const reports = config.get('reports').value()

	reports.forEach(async (report) => {

		const ids = report.ids

		const getData = async () => {
			return Promise.all(ids.map((id) => ackee.domain(id)))
		}

		const data = await getData()

		if (report.type === 'email') {
			await emailReport(data, report)
		}

	})
}

run()