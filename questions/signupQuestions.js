const validator = require('validator')

const validatePassword = value => {
  return (value.length >= 6) ? true : 'Le mot de passe doit être contenir au minimum 6 charactères'
}

const validateEmail = value => {
  return validator.isEmail(value) ? true : 'Email invalide, réessayez'
}

const signUpQuestions =
[{
  name: 'email',
  type: 'input',
  message: `Veuillez entrer un email pour créer votre compte :  `,
  validate: validateEmail
}, {
  name: 'password',
  type: 'password',
  message: 'Veuillez entrer un mot de passe :  ',
  validate: validatePassword
}, {
  name: 'passwordConfirmation',
  type: 'password',
  message: 'Veuillez confirmer le mot de passe :  ',
  validate: validatePassword
}]

module.exports = { signUpQuestions }
