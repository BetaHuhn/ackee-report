#!/usr/bin/env node

const program = require('commander')
const packageJson = require('../package.json')
const Runner = require('./Runner')

program
	.version(packageJson.version, '-v, --version')
	.description('CLI tool to generate performance reports of websites using the self-hosted analytics tool Ackee.')
	.usage('<command> [options]')

program
	.command('email')
	.description('Generate report and send it via email')
	.option('-d, --domain <titles...>', 'specify domains by title')
	.option('-i, --id <ids...>', 'specify domains by id')
	.option('-t, --to <recipient...>', 'to whom the report should be sent')
	.option('-r, --range <range>', 'specify data range', 'month')
	.option('-l, --limit <number>', 'limit number of list items', 3)
	.option('-e, --events [type]', 'get event data', false)
	.option('-s, --style <name>', 'email style to use', 'ackee')
	.action(async (args, program) => {
		const runner = new Runner(args, program)

		const data = await runner.getData()
		if (!data) return

		runner.email(data)
	})

program
	.command('json')
	.description('Query API for data and output it to JSON file')
	.option('-d, --domain <titles...>', 'specify domains by title')
	.option('-i, --id <ids...>', 'specify domains by id')
	.option('-o, --output <file>', 'path to output file', 'report.json')
	.option('-r, --range <range>', 'specify data range', 'month')
	.option('-l, --limit <number>', 'limit number of list items', 3)
	.option('-e, --events [type]', 'get event data', false)
	.action(async (args, program) => {
		const runner = new Runner(args, program)

		const data = await runner.getData()
		if (!data) return

		runner.json(data)
	})

program
	.command('rss')
	.alias('xml')
	.description('Generate report as a RSS feed')
	.option('-d, --domain <titles...>', 'specify domains by title')
	.option('-i, --id <ids...>', 'specify domains by id')
	.option('-o, --output <file>', 'path to output file', 'report.xml')
	.option('-r, --range <range>', 'specify data range', 'month')
	.option('-l, --limit <number>', 'limit number of list items', 3)
	.option('-e, --events [type]', 'get event data', false)
	.action(async (args, program) => {
		const runner = new Runner(args, program)

		const data = await runner.getData()
		if (!data) return

		runner.rss(data)
	})

program
	.command('domains [titles...]')
	.alias('domain')
	.description('get domain id by title')
	.action((args, program) => {
		const runner = new Runner(args, program)
		runner.domains()
	})

program
	.command('config')
	.description('output current config')
	.action((args, program) => {
		const runner = new Runner(args, program)
		runner.outputConfig()
	})

program.on('--help', () => {
	console.log('')
	console.log('Example call:')
	console.log('  $ ackee-report email --domain example.com --to hello@example.com')
})

program.on('command:*', (operands) => {
	console.error(`error: unknown command '${ operands[0] }'\n`)
	program.help()
	process.exitCode = 1
})

program.parse(process.argv)