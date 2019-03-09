const inquirer = require('inquirer')

const { signUpQuestions } = require('../../questions/signupQuestions')
const { loginQuestionsPasswordAndEmail, loginQuestionsPasswordOnly } = require('../../questions/loginQuestions')
const { postUser, postLogin, deleteUserMeToken } = require('./httpQueries/httpQueries')

const performLogin = () => {
  if (global.emailLogin) {
    return askForPasswordOnly()
  } else {
    return askForEmailAndPassword()
  }
}

const askForPasswordOnly = () => {
  return inquirer.prompt(loginQuestionsPasswordOnly)
    .then((answers) => {
      return postLogin(global.emailLogin, answers.password)
    })
}

const askForEmailAndPassword = () => {
  return inquirer.prompt(loginQuestionsPasswordAndEmail)
    .then((answers) => {
      return postLogin(answers.emailLogin, answers.password)
    })
}

const performSignUp = () => {
  return inquirer.prompt(signUpQuestions)
    .then((answers) => {
      if (answers.password !== answers.passwordConfirmation) {
        throw new Error('Les mots de passes ne sont pas identiques')
      }

      return postUser(answers.email, answers.password)
    })
}

const performLoginOrSignUp = () => {
  if (global['sign-up'] === true) {
    return performSignUp()
  } else {
    return performLogin()
  }
}

const computeSearchCriteriasExternal = (answers) => {
  let searchCriterias = {
    min_tituAndSubs: answers.min_tituAndSubs,
    min_tituAndSubsLast10games: answers.min_tituAndSubsLast10games,
    max_cote: answers.max_cote
  }

  switch (answers.position) {
    case 'Tous':
      break
    case 'Tous sauf G':
      searchCriterias.position = 'D|M|A'
      break
    case 'D':
    case 'M':
    case 'A':
    case 'G':
      searchCriterias.position = answers.position
      break
    default:
  }
  return searchCriterias
}

const closeConnectionExternal = () => {
  return deleteUserMeToken()
}

const startExternalScript = () => {
  return performLoginOrSignUp()
}

module.exports = {
  performLoginOrSignUp,
  computeSearchCriteriasExternal,
  closeConnectionExternal,
  startExternalScript
}
