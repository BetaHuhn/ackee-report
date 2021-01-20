module.exports = {
	range: {
		day: {
			input: 'LAST_24_HOURS',
			name: 'day',
			days: 1,
			interval: 'daily'
		},
		week: {
			input: 'LAST_7_DAYS',
			name: 'week',
			days: 7,
			interval: 'weekly'
		},
		month: {
			input: 'LAST_30_DAYS',
			name: 'month',
			days: 30,
			interval: 'monthly'
		},
		six_months: {
			input: 'LAST_6_MONTHS',
			name: '6 months',
			days: 182,
			interval: 'half-yearly'
		}
	},
	style: [ 'ackee', 'basic' ],
	eventType: {
		avg: 'AVERAGE',
		total: 'TOTAL'
	}
}