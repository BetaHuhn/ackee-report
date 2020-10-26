#!/usr/bin/env node

const program = require('commander')
const packageJson = require('../package.json')
const Runner = require('./Runner')

program
	.version(packageJson.version, '-v, --version')

program
	.command('send')
	.alias('report')
	.description('generate report and send via specified service')
	.option('-s, --service <name>', 'service to use', 'email')
	.option('-d, --domain <titles...>', 'specify domains by title')
	.option('-i, --id <ids...>', 'specify domains by id')
	.option('-t, --to <recipient...>', 'to whom the report should be sent')
	.action((args, program) => {
		const runner = new Runner(args, program)
		runner.report()
	})

program
	.command('domains [titles...]')
	.alias('domain')
	.description('list all domains')
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