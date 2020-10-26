const axios = require('axios')

class Ackee {
	constructor(server, username, password) {
		this.username = username
		this.password = password

		this.axios = axios.create({ baseURL: endpoint(server) })

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

	async domains() {
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

	async domain(id) {
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
							languages(sorting: TOP, limit:5) {
								id
								count
							}
							browsers(sorting: TOP, type: WITH_VERSION, limit:5) {
								id
								count
							}
							devices(sorting: TOP, type: WITH_MODEL, limit:5) {
								id
								count
							}
							sizes(sorting: TOP, type: SCREEN_RESOLUTION, limit:5) {
								id
								count
							}
							systems(sorting: TOP, type: NO_VERSION, limit:5) {
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

}

const endpoint = function(server) {
	const hasTrailingSlash = server.substr(-1) === '/'
	return server + (hasTrailingSlash === true ? '' : '/')
}

module.exports = Ackee