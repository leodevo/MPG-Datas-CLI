const argv = require('yargs')
  .option('local', {
    alias: 'l',
    default: false,
    boolean: true,
    describe: 'Determine whether to use local DB or external REST API'
  })
  .option('sign-up', {
    alias: 's',
    default: false,
    boolean: true,
    describe: 'To sign up new account'
  })
  .option('emailLogin', {
    alias: '@',
    describe: 'Email used to login'
  })
  .help()
  .argv

module.exports = { argv }
