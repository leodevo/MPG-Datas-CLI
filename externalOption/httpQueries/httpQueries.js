const rp = require('request-promise')

const postUser = (email, password) => {
  const options = {
    method: 'POST',
    uri: process.env.APP_TARGET_URI + '/users',
    body: {
      email,
      password
    },
    resolveWithFullResponse: true,
    json: true // Automatically stringifies the body to JSON
  }

  console.log('(send) : uri : ', options.uri)
  console.log('(send) : body : ', options.body)

  return rp(options)
    .then(response => {
      console.log('response.headers : ', response.headers)
      console.log('response.body : ', response.body)

      return response.headers['x-auth']
    })
    .catch(err => {
      console.log('error | response.statusCode : ', err.statusCode)
      console.log(err.message)
    })
}

const postLogin = (email, password) => {
  const options = {
    method: 'POST',
    uri: process.env.APP_TARGET_URI + '/users/login',
    body: {
      email,
      password
    },
    resolveWithFullResponse: true,
    json: true // Automatically stringifies the body to JSON
  }

  console.log('(send) : uri : ', options.uri)
  console.log('(send) : body : ', options.body)

  return rp(options)
    .then(response => {
      console.log('response.headers : ', response.headers)
      console.log('response.body : ', response.body)

      return response.headers['x-auth']
    })
    .catch(err => {
      console.log('error | response.statusCode : ', err.statusCode)
      console.log(err.message)
    })
}

module.exports = {
  postUser,
  postLogin
}
