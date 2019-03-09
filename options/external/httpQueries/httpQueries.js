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
      global['x-auth_token'] = response.headers['x-auth']
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
    json: true
  }

  return rp(options)
    .then(response => {
      global['x-auth_token'] = response.headers['x-auth']
    })
}

const getPlayersExternal = (searchCriterias) => {
  const options = {
    method: 'GET',
    uri: process.env.APP_TARGET_URI + '/players',
    headers: {
      'x-auth': global['x-auth_token']
    },
    qs: searchCriterias,
    resolveWithFullResponse: true,
    json: true
  }

  return rp(options)
    .then(response => {
      console.log('response.body.players.length : ', response.body.players.length)
      return response.body.players
    })
}

const deleteUserMeToken = (email, password) => {
  const options = {
    method: 'DELETE',
    uri: process.env.APP_TARGET_URI + '/users/me/token',
    headers: {
      'x-auth': global['x-auth_token']
    },
    resolveWithFullResponse: true,
    json: true
  }

  return rp(options)
    .then(response => {
      // TODO: retry mechanism if statusCode != 200 ?
      return response
    })
}

module.exports = {
  postUser,
  postLogin,
  getPlayersExternal,
  deleteUserMeToken
}
