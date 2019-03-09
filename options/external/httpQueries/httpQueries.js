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
    .catch((e) => {
      if (e.statusCode === 400) {
        console.log('\n Impossible de se connecter avec les identifiants fournis. (Si vous utilisez ce client pour la première fois, pensez à d\'abord sign up avec l\'argument -s : \'npm start -s\' \n \n'.bold)
        throw new Error()
      }
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
