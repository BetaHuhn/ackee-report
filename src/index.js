const loadConfig = require('./utils/config')
const log = require('./utils/log')

const config = loadConfig()

log.info(config.value())