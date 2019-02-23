const argv = require('yargs')
  .option('local', {
    alias: 'l',
    default: false,
    boolean: true,
    describe: 'boolean to determine whether to use local DB or external REST API'
  })
  .help()
  .argv

module.exports = { argv }
