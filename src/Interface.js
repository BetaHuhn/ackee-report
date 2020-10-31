const axios = require('axios')
const loadConfig = require('./Config')

class Ackee {
	constructor() {
		const config = loadConfig()

		this.token = config.get('ackee.token')
		this.username = config.get('ackee.username')
		this.password = config.get('ackee.password')

		const endpoint = this._endpoint(config.get('ackee.server'))

		this.axios = axios.create({ baseURL: endpoint })

		this.axios.interceptors.response.use((response) => {
			if (response.data.errors !== undefined) {
				const err = new Error()
				err.name = 'AckeeApiError'
				err.message = response.data.errors[0].message
				err.details = response.data.errors
				throw err
			}

			return response
		}, (err) => {
			if (err && err.response && err.response.data) {
				console.log(err.response)
				err.name = 'AckeeApiError'
				err.message = `${ err.response.data } (${ err.response.statusCode } status code)`
				throw err
			} else {
				console.error(err)
				throw err
			}
		})
	}

	async login() {
		if (this.token) {
			this.axios.defaults.headers.common['Authorization'] = `Bearer ${ this.token }`
			return
		}

		try {
			const query = `
				mutation createToken($input: CreateTokenInput!) {
					createToken(input: $input) {
						payload {
							id
						}
					}
				}
			`

			const variables = {
				input: {
					username: this.username,
					password: this.password
				}
			}

			const { data } = await this.axios.post('api',
				JSON.stringify({
					query,
					variables
				})
			)

			const token = data.data.createToken.payload.id

			this.axios.defaults.headers.common['Authorization'] = `Bearer ${ token }`

		} catch (err) {
			console.error(err)
			process.exit(0)
		}

	}

	async getDomains() {
		try {
			const query = `
				query getDomains {
					domains {
						id
						title
					}
				}
			`

			const { data } = await this.axios.post('api',
				JSON.stringify({
					query
				})
			)

			const domains = data.data.domains

			return domains

		} catch (err) {
			console.error(err)
			process.exit(0)
		}
	}

	async get(ids) {
		const getData = async () => Promise.all(ids.map((id) => this._getDomainData(id)))
		const data = await getData()

		const durationAvg = () => {
			const durations = data.filter((domain) => domain.facts.averageDuration > 0)
			const avg = data.reduce((n, { facts }) => n + facts.averageDuration, 0) / durations.length
			return Math.round(avg / 1000)
		}

		const names = data.map((domain) => domain.title).join(', ')
		const namesShort = (data.length > 2) ? (data.slice(0, 2).map((domain) => domain.title).join(', ') + ` and ${ data.length - 2 } more`) : (data.map((domain) => domain.title).join(', '))

		const total = data.reduce((n, { facts }) => n + facts.viewsMonth, 0)
		const viewsYear = data.reduce((n, { facts }) => n + facts.viewsYear, 0)

		const domains = data.map((domain) => {
			return {
				id: domain.id,
				title: domain.title,
				viewsAvgDay: domain.facts.averageViews,
				viewsMonth: domain.facts.viewsMonth,
				viewsYear: domain.facts.viewsYear,
				durationAvg: Math.round(domain.facts.averageDuration / 1000),
				pages: domain.statistics.pages,
				referrers: domain.statistics.referrers,
				languages: domain.statistics.languages,
				browsers: domain.statistics.browsers,
				devices: domain.statistics.devices,
				sizes: domain.statistics.sizes,
				systems: domain.statistics.systems
			}
		})

		const result = {
			views: total,
			viewsYear: viewsYear,
			durationAvg: durationAvg(),
			names,
			namesShort,
			domains
		}

		return result
	}

	async _getDomainData(id) {
		try {
			const query = `
				query getDomain($id: ID!) {
					domain(id: $id) {
						id
						title
						facts {
							averageViews
							averageDuration
							viewsMonth
							viewsYear
						}
						statistics {
							pages(sorting: TOP, limit:5) {
								id
								count
							}
							referrers(sorting: TOP, limit:5) {
								id
								count
							}
							languages(sorting: TOP, limit:3) {
								id
								count
							}
							browsers(sorting: TOP, type: WITH_VERSION, limit:3) {
								id
								count
							}
							devices(sorting: TOP, type: WITH_MODEL, limit:3) {
								id
								count
							}
							sizes(sorting: TOP, type: SCREEN_RESOLUTION, limit:3) {
								id
								count
							}
							systems(sorting: TOP, type: NO_VERSION, limit:3) {
								id
								count
							}
						}
					}
				}
			`

			const variables = {
				id: id
			}

			const { data } = await this.axios.post('api',
				JSON.stringify({
					query,
					variables
				})
			)

			const domain = data.data.domain

			return domain

		} catch (err) {
			console.error(err)
			process.exit(0)
		}
	}

	_endpoint(server) {
		const hasTrailingSlash = server.substr(-1) === '/'
		return server + (hasTrailingSlash === true ? '' : '/')
	}

}

module.exports = Ackee