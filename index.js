// TODO fix vulnerabilities

const { argv } = require('./yargsCustom')

const inquirer = require('inquirer')
const EventEmitter = require('events')
require('colors')
const { process } = require('./process/process')


const { processDbResults } = require('./process/processDbResults')
let { mongoose } = require('./db/mongoose')
const { Player } = require('./models/player')
const { questions, finalQuestion } = require('./questions/questions')
const { greetings } = require('./cosmetics/cosmetics')
const { isPositiveResponse } = require('./process/processTools')

function promptQuestions () {
  inquirer.prompt(questions).then((answers) => {
    let searchCriterias = process.computeSearchCriterias(answers)

    Player.find(searchCriterias)
      .then(players => {
        return processDbResults(players, answers)
      })
      .then(displayTable => {
        console.log(displayTable.toString() + '\n')
        promptFinaleQuestion()
      })
      .catch((e) => {
        console.log(e)
        mongoose.connection.close()
      })
  }).catch((e) => {
    console.log(e)
    mongoose.connection.close()
  })
}

function promptFinaleQuestion () {
  inquirer.prompt(finalQuestion).then((answers) => {
    if (isPositiveResponse(answers.continue)) {
      console.log('\n')
      promptQuestions()
    } else {
      mongoose.connection.close()
    }
  }).catch((e) => {
    console.log(e)
    mongoose.connection.close()
  })
}

const myEmitter = new EventEmitter()

mongoose.connection.once('connected', function () {
  greetings()
  myEmitter.emit('start Application')
})

myEmitter.on('start Application', () => {
  promptQuestions()
})
