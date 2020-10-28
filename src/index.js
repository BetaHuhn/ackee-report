#!/usr/bin/env node

const program = require('commander')
const packageJson = require('../package.json')
const Runner = require('./Runner')

program
	.version(packageJson.version, '-v, --version')

program
	.command('email')
	.description('Generate report and send it via email')
	.option('-d, --domain <titles...>', 'specify domains by title')
	.option('-i, --id <ids...>', 'specify domains by id')
	.option('-t, --to <recipient...>', 'to whom the report should be sent')
	.option('-s, --style <name>', 'email style to use', 'ackee')
	.action((args, program) => {
		const runner = new Runner(args, program)
		runner.email()
	})

program
	.command('json')
	.description('Query API for data and output it to JSON file')
	.option('-d, --domain <titles...>', 'specify domains by title')
	.option('-i, --id <ids...>', 'specify domains by id')
	.option('-o, --output <file>', 'path to output file', 'report.json')
	.action((args, program) => {
		const runner = new Runner(args, program)
		runner.json()
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

program.on('command:*', (operands) => {
	console.error(`error: unknown command '${ operands[0] }'\n`)
	program.help()
	process.exitCode = 1
})

program.parse(process.argv)