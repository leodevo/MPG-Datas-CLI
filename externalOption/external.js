const { signUpQuestions } = require('../questions/signupQuestions')
const { loginQuestionsPasswordAndEmail, loginQuestionsPasswordOnly } = require('../questions/loginQuestions')
const inquirer = require('inquirer')

const performLogin = () => {
  console.log('performing login')
  if (global.emailLogin) {
    return askForPasswordOnly()
  } else {
    return askForEmailAndPassword()
  }
}

const askForPasswordOnly = () => {
  console.log('asking for password only')
  return inquirer.prompt(loginQuestionsPasswordOnly)
    .then((answers) => {
      console.log('email : ', answers.email)
      console.log('password : ', answers.password)
    })
    .catch((e) => {
      console.log(e)
    })
}

const askForEmailAndPassword = () => {
  return inquirer.prompt(loginQuestionsPasswordAndEmail)
    .then((answers) => {
      console.log('email : ', answers.email)
      console.log('password : ', answers.password)
    })
    .catch((e) => {
      console.log(e)
    })
}

const performSignUp = () => {
  return inquirer.prompt(signUpQuestions)
    .then((answers) => {
      console.log('email : ', answers.email)
      console.log('password : ', answers.password)
      console.log('passwordConfirmation : ', answers.passwordConfirmation)

      if (answers.password !== answers.passwordConfirmation) {
        throw new Error('Les mots de passes ne sont pas identiques')
      }

      return ('yo')
    })
    .catch((e) => {
      console.log(e)
    })
}

const performLoginOrSignUp = () => {
  if (global['sign-up'] === true) {
    return performSignUp()
  } else {
    return performLogin()
  }
}

module.exports = {
  performLoginOrSignUp
}
