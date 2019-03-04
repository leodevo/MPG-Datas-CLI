var env = process.env.NODE_ENV || 'production'

console.log('**** ENV **** : ', env)

let config = require('./config.json')
let envConfig = config[env]

Object.keys(envConfig).forEach((key) => {
  process.env[key] = envConfig[key]
})
