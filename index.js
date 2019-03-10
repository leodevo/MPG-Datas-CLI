// TODO: fix node_modules vulnerabilities
// TODO: get number of games values from server
require('./config/config')
require('./initalInputProcessing/initialInputProcess')
require('colors')
const inquirer = require('inquirer')

const processDbResults = require('./processResults/processDbResults')
const { questions, finalQuestion } = require('./questions/mainQuestions')
const { greetings, printGoodBye } = require('./cosmetics/cosmetics')
const { isPositiveResponse } = require('./processResults/processTools')
const { processResults } = require('./processResults/processResults')
const { getPlayersExternal } = require('./options/external/httpQueries/httpQueries')
const { closeConnectionExternal, startExternalScript } = require('./options/external/external')
const { getPlayerLocal, closeConnectionLocal, startLocalScript } = require('./options/local/local')

const getPlayers = (searchCriterias) => {
  if (global.appTarget === 'local') {
    return getPlayerLocal(searchCriterias)
  } else {
    return getPlayersExternal(searchCriterias)
  }
}

const endProcess = () => {
  let closeConnection

  if (global.appTarget === 'local') {
    closeConnection = closeConnectionLocal
  } else {
    closeConnection = closeConnectionExternal
  }

  closeConnection()
    .then(() => {
      printGoodBye()
    })
    .catch((e) => {
      console.log(e)
    })
}

function startMainProcess () {
  inquirer.prompt(questions).then((answers) => {
    let searchCriterias = processResults.computeSearchCriterias(answers)

    getPlayers(searchCriterias)
      .then(players => {
        console.log(players.length)
        return processDbResults(players, answers)
      })
      .then(displayTable => {
        console.log(displayTable.toString() + '\n')
        promptFinaleQuestion()
      })
      .catch((e) => {
        console.log(e)
        endProcess()
      })
  }).catch((e) => {
    console.log(e)
    endProcess()
  })
}

function promptFinaleQuestion () {
  inquirer.prompt(finalQuestion).then((answers) => {
    if (isPositiveResponse(answers.continue)) {
      console.log('\n')
      startMainProcess() // Restarting the main process
    } else {
      endProcess()
    }
  }).catch((e) => {
    console.log(e)
    endProcess()
  })
}

const startScript = () => {
  greetings()

  let script

  if (global.appTarget === 'local') {
    script = startLocalScript
  } else {
    script = startExternalScript
  }

  script()
    .then(() => {
      startMainProcess()
    }, (err) => {
      console.log(err)
    })
}

startScript()
