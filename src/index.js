#!/usr/bin/env node

const program = require('commander')
const packageJson = require('../package.json')
const Runner = require('./Runner')

program
	.version(packageJson.version, '-v, --version')

program
	.command('generate')
	.alias('report')
	.description('Generates report and sends it via specified service')
	.option('-d, --domain <titles...>', 'specify domains by title')
	.option('-i, --id <ids...>', 'specify domains by id')
	.option('-t, --to <recipient...>', 'to whom the report should be sent (when using email)')
	.option('-o, --output <file>', 'path to output file (when using email)')
	.option('-s, --service <name>', 'service to use', 'email')
	.action((args, program) => {
		const runner = new Runner(args, program)
		runner.report()
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