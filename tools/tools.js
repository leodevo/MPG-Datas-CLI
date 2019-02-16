const { constants } = require('./../constant')

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

const isPositiveResponse = value => {
  return (value.toUpperCase() === 'O' || value.toUpperCase() === 'OUI')
}

function compareAverage (a, b) {
  return (a.average < b.average) ? 1 : -1
}

function compareCoteIncreasing (a, b) {
  return (a.cote > b.cote) ? 1 : -1
}

function compareCoteDecreasing (a, b) {
  return (a.cote < b.cote) ? 1 : -1
}

function compareAverageLast10Games (a, b) {
  return (a.averageLast10games < b.averageLast10games) ? 1 : -1
}

function compareAverageFromXLastGames (a, b) {
  return (a.averageFromXLastGames < b.averageFromXLastGames) ? 1 : -1
}

function compareGoals (a, b) {
  return (a.goals < b.goals) ? 1 : -1
}

module.exports = {
  calculateAverageAndAppearancesFromLastGames,
  compareAverage,
  compareCoteIncreasing,
  compareCoteDecreasing,
  compareAverageLast10Games,
  compareAverageFromXLastGames,
  compareGoals,
  isPositiveResponse
}
