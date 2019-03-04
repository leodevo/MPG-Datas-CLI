const validator = require('validator')

const validatePassword = value => {
  return (value.length >= 6) ? true : 'Le mot de passe doit être contenir au minimum 6 charactères'
}

const validateEmail = value => {
  return validator.isEmail(value) ? true : 'Email invalide, réessayez'
}

const loginQuestionsPasswordAndEmail =
[{
  name: 'email',
  type: 'input',
  message: 'Login - veuillez entrer votre email : ',
  validate: validateEmail
}, {
  name: 'password',
  type: 'password',
  message: 'Veuillez entrer votre mot de passe :  ',
  validate: validatePassword
}]

const loginQuestionsPasswordOnly = [{
  name: 'password',
  type: 'password',
  message: 'Veuillez entrer votre mot de passe :  ',
  validate: validatePassword
}]

module.exports = { loginQuestionsPasswordAndEmail, loginQuestionsPasswordOnly }
