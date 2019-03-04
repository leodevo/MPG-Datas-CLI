const { constants } = require('../constants/generalConstant')

const {
  compareAverage,
  compareCoteIncreasing,
  compareCoteDecreasing,
  compareAverageLast10Games,
  compareAverageFromXLastGames,
  compareGoals
} = require('./processTools')

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
    case 'G':
      searchCriterias.position = answers.position
      break
    default:
  }
  return searchCriterias
}

function calculateAverageAndAppearancesFromLastGames (gamesGrades, numberOfLastGames) {
  if (Array.isArray(gamesGrades) &&
    gamesGrades.length &&
    numberOfLastGames &&
    numberOfLastGames <= constants.NUMBER_OF_GAMES)
  {
    let lastGamesGrades = gamesGrades.slice(constants.NUMBER_OF_GAMES - numberOfLastGames + 1)

    let sumOfGrades = lastGamesGrades.reduce(function (accumulator, currentValue, currentIndex, array) {
      return accumulator + currentValue
    }, 0)

    let titusAndSubsFromLastGames = lastGamesGrades.reduce(function (accumulator, currentValue, currentIndex, array) {
      return (currentValue === null) ? accumulator : ++accumulator
    }, 0)

    let averageFromXLastGames = null

    if (titusAndSubsFromLastGames) {
      averageFromXLastGames = (sumOfGrades / titusAndSubsFromLastGames).toFixed(3)
    }

    return { averageFromXLastGames, titusAndSubsFromLastGames }
  }
}

function computeAdditionnalDatas (players, numberOfLastGames) {
  players.forEach(player => {
    const { averageFromXLastGames, titusAndSubsFromLastGames } = calculateAverageAndAppearancesFromLastGames(player.grades, numberOfLastGames)
    player.averageFromXLastGames = averageFromXLastGames
    player.titusAndSubsFromLastGames = titusAndSubsFromLastGames
  })
}

const processResults = {
  sortPlayers,
  cleanAndEnhancePlayerDatas,
  pushPlayerDatas,
  computeSearchCriterias,
  computeAdditionnalDatas
}

module.exports = {
  processResults
}
