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

function compareAverage (a, b) {
  if (a.average < b.average) {
    return 1
  } else {
    return -1
  }
}

function compareCoteIncreasing (a, b) {
  if (a.cote > b.cote) {
    return 1
  } else {
    return -1
  }
}

function compareCoteDecreasing (a, b) {
  if (a.cote < b.cote) {
    return 1
  } else {
    return -1
  }
}

function compareAverageLast10Games (a, b) {
  if (a.averageLast10games < b.averageLast10games) {
    return 1
  } else {
    return -1
  }
}
function compareAverageFromXLastGames (a, b) {
  if (a.averageFromXLastGames < b.averageFromXLastGames) {
    return 1
  } else {
    return -1
  }
}

function compareGoals (a, b) {
  if (a.goals < b.goals) {
    return 1
  } else {
    return -1
  }
}

module.exports = {
  calculateAverageAndAppearancesFromLastGames,
  compareAverage,
  compareCoteIncreasing,
  compareCoteDecreasing,
  compareAverageLast10Games,
  compareAverageFromXLastGames,
  compareGoals
}
