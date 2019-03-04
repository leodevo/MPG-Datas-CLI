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
  compareAverage,
  compareCoteIncreasing,
  compareCoteDecreasing,
  compareAverageLast10Games,
  compareAverageFromXLastGames,
  compareGoals,
  isPositiveResponse
}
