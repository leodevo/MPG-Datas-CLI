// TODO fix vulnerabilities
require('./config/config')
require('./initalInputProcessing/initialInputProcess')
require('colors')
const inquirer = require('inquirer')
const EventEmitter = require('events')

const { processDbResults } = require('./processResults/processDbResults')
let { mongoose } = require('./db/mongoose')
const { Player } = require('./models/player')
const { questions, finalQuestion } = require('./questions/mainQuestions')
const { greetings } = require('./cosmetics/cosmetics')
const { isPositiveResponse } = require('./processResults/processTools')
const { processResults } = require('./processResults/processResults')

const getPlayers = (searchCriterias) => {
  if (global.appTarget === 'local') {
    return Player.find(searchCriterias)
  } else {
    //send query
  }
}

const closeConnection = () => {
  if (global.appTarget === 'local') {
    mongoose.connection.close()
  } else {
    //send delete/me/token
  }
}

function startMainProcess () {
  inquirer.prompt(questions).then((answers) => {
    let searchCriterias = processResults.computeSearchCriterias(answers)

    //Player.find(searchCriterias) //getPlayers(searchCriteria)
    getPlayers(searchCriterias)
      .then(players => {
        return processDbResults(players, answers)
      })
      .then(displayTable => {
        console.log(displayTable.toString() + '\n')
        promptFinaleQuestion()
      })
      .catch((e) => {
        console.log(e)
        closeConnection() //endProcess(env)
      })
  }).catch((e) => {
    console.log(e)
    closeConnection() //endProcess(env)
  })
}

function promptFinaleQuestion () {
  inquirer.prompt(finalQuestion).then((answers) => {
    if (isPositiveResponse(answers.continue)) {
      console.log('\n')
      startMainProcess()
    } else {
      closeConnection() //endProcess(env)
    }
  }).catch((e) => {
    console.log(e)
    closeConnection() //endProcess(env)
  })
}

const startLocalScript = () => {
  const myEmitter = new EventEmitter()

  mongoose.connection.once('connected', function () {
    greetings()
    myEmitter.emit('start Application')
  })

  myEmitter.on('start Application', () => {
    startMainProcess()
  })
}

const startExternalScript = () => {
  const { performLoginOrSignUp } = require('./externalOption/external')
  greetings()
  performLoginOrSignUp()
    .then(token => {
      console.log('got da token broooooo ', token)
      console.log('hey 2 : will perform mainProcess')
      //startMainProcess()
    })
}

const startScript = () => {
  if (global.appTarget === 'local') {
    startLocalScript()
  } else {
    startExternalScript()
  }
}

startScript()
