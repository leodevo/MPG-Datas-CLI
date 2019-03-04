const { argv } = require('./yargsCustom')
const validator = require('validator')

global.appTarget = argv.local ? 'local' : 'external'
global['sign-up'] = argv['sign-up']

console.log(`Script run with ${global.appTarget} target`)

if (global.appTarget === 'external') {
  console.log(`sign-up ? ${global['sign-up']}`)

  if (global['sign-up'] === false) {
    if (argv['emailLogin']) {
      global['emailLogin'] = argv['emailLogin']
      if (!validator.isEmail(global['emailLogin'])) {
        throw new Error('Email fourni invalide !')
      }

      console.log('Email fourni pour login : ', global['emailLogin'])
    }
  }
}
