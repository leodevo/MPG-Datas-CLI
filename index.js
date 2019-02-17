const inquirer = require('inquirer')
const EventEmitter = require('events')
const Table = require('cli-table2')
require('colors')

const { constants } = require('./constant')
let { mongoose } = require('./db/mongoose')
const { Player } = require('./models/player')
const { questions, finalQuestion } = require('./questions/questions')
const { greetings, logSeparation } = require('./cosmetics/cosmetics')
const {
  calculateAverageAndAppearancesFromLastGames,
  compareAverage,
  compareCoteIncreasing,
  compareCoteDecreasing,
  compareAverageLast10Games,
  compareAverageFromXLastGames,
  compareGoals,
  isPositiveResponse
} = require('./tools/tools')

const tableCharacteristics = {
  chars: {
    'top': '═',
    'top-mid': '╤',
    'top-left': '╔',
    'top-right': '╗',
    'bottom': '═',
    'bottom-mid': '╧',
    'bottom-left': '╚',
    'bottom-right': '╝',
    'left': '║',
    'left-mid': '╟',
    'mid': '─',
    'mid-mid': '┼',
    'right': '║',
    'right-mid': '╢',
    'middle': '│'
  },
  head:
    [
      '',
      'poste'.bold,
      'Nom'.bold,
      'Equipe'.bold,
      'Cote'.bold,
      'Buts'.bold,
      '--',
      ' Moyenne \n \n(10 der.)'.bold,
      'Moyenne \n \n(total)'.bold,
      '--',
      'Nbr. Mat. joués \n \n(10 der. mat.)'.bold,
      'Mat. joués \n \n  (total)'.bold,
      '% Titularisations \n \n(tot. mat. joués)'.bold
    ],
  style: {
    head: [] // Disable colors in header cells
  }
}

const createTableCharacteristicsAdditionalDatas = (numberOfLastGames) => {
  return {
    chars: tableCharacteristics.chars,
    head:
    [
      ...tableCharacteristics.head,
      ('--'),
      `Moyenne \n \n(${numberOfLastGames} der.)`.bold,
      `Nbr. Mat. joués \n \n (${numberOfLastGames} der. mat.)`.bold
    ],
    style: tableCharacteristics.style
  }
}

function sortPlayers (players, answers) {
  switch (answers.sorting) {
    case 'Cote (croissant)':
      players.sort(compareCoteIncreasing)
      break
    case 'Cote (décroissant)':
      players.sort(compareCoteDecreasing)
      break
    case 'Note Moy.':
      players.sort(compareAverage)
      break
    case 'Nombre de buts':
      players.sort(compareGoals)
      break
    case 'Note Moy. (10 derniers matchs)':
      players.sort(compareAverageLast10Games)
      break
    case `Note moy. (${answers.numberOfLastGames} derniers matchs)`:
      players.sort(compareAverageFromXLastGames)
      break
    default:
      throw new Error('Invalid Sorting Choice !')
  }
}

const cleanAndEnhancePlayerDatas = (player, rank) => {
  player.rank = rank

  if (player.average !== null) {
    player.average = player.average.toFixed(constants.NUMBER_DISPLAY_DECIMALS_AVERAGE)
  }

  if (player.averageLast10games !== null) {
    player.averageLast10games = player.averageLast10games.toFixed(constants.NUMBER_DISPLAY_DECIMALS_AVERAGE)
  }

  if (player.titularisations !== 0 && player.tituAndSubs !== 0) {
    player.titularisationsPercentage = (player.titularisations / player.tituAndSubs * 100).toFixed(2).toString() + '%'
  } else if (player.tituAndSubs !== 0 && player.titularisations === 0) {
    player.titularisationsPercentage = '0.00%'
  } else {
    player.titularisationsPercentage = null
  }

  if (player.name === null || player.cote === null || player.tituAndSubs === null) {
    console.log(`Joueur : ${player.name} ignoré (valeurs incorrects)`)
    return 0
  }
}

function pushPlayerDatas (player, displayTable, displayAdditionalDatas) {
  let arrayToPush = [
    player.rank,
    player.position,
    player.name, player.team,
    player.cote, player.goals,
    '--',
    player.averageLast10games,
    player.average,
    '--',
    player.tituAndSubsLast10games,
    player.tituAndSubs,
    player.titularisationsPercentage
  ]

  if (displayAdditionalDatas) {
    arrayToPush.push(
      '--',
      player.averageFromXLastGames,
      player.titusAndSubsFromLastGames
    )
  }

  displayTable.push(arrayToPush)
}

function computeSearchCriterias (answers) {
  let searchCriterias = {
    tituAndSubs: { $gte: answers.tituAndSubsMin },
    tituAndSubsLast10games: { $gte: answers.tituAndSubsMinLast10games },
    cote: { $lte: answers.coteMax }
  }

  switch (answers.position) {
    case 'Tous':
      break
    case 'Tous sauf G':
      searchCriterias.position = { $ne: 'G' }
      break
    case 'D':
    case 'M':
    case 'A':
      searchCriterias.position = answers.position
      break
    default:
  }
  return searchCriterias
}

function computeAdditionnalDatas (players, numberOfLastGames) {
  players.forEach(player => {
    const { averageFromXLastGames, titusAndSubsFromLastGames } = calculateAverageAndAppearancesFromLastGames(player.grades, numberOfLastGames)
    player.averageFromXLastGames = averageFromXLastGames
    player.titusAndSubsFromLastGames = titusAndSubsFromLastGames
  })
}

function processDbResults (players, answers) {
  let displayTable
  const displayAdditionalDatas = answers.additionalDatas && answers.numberOfLastGames

  logSeparation()
  console.log(`\n \t \t \t \t    Nombre de joueurs correspondant aux critères de recherche : ${players.length} \n \n`.bold)

  if (displayAdditionalDatas) {
    computeAdditionnalDatas(players, answers.numberOfLastGames)
    displayTable = new Table(createTableCharacteristicsAdditionalDatas(answers.numberOfLastGames))
  } else {
    displayTable = new Table(tableCharacteristics)
  }

  sortPlayers(players, answers)

  // Keeping only players to display
  players = players.slice(0, answers.numberOfPlayerToDisplay)

  let rank = 1
  players.forEach(player => {
    cleanAndEnhancePlayerDatas(player, rank)
    pushPlayerDatas(player, displayTable, displayAdditionalDatas)
    rank++
  })

  console.log(displayTable.toString() + '\n')
  promptFinaleQuestion()
}

function promptQuestions () {
  inquirer.prompt(questions).then((answers) => {
    let searchCriterias = computeSearchCriterias(answers)

    Player.find(searchCriterias)
      .then((players) => {
        processDbResults(players, answers)
      }).catch((e) => {
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
