const Table = require('cli-table2')

const { processResults } = require('./processResults')
const {
  tableCharacteristics,
  createTableCharacteristicsAdditionalDatas
} = require('../constants/tableConstants')
const { logSeparation } = require('../cosmetics/cosmetics')

function processDbResults (players, answers) {
  const createDisplayTable = new Promise(function (resolve, reject) {
    let displayTable
    const displayAdditionalDatas = answers.additionalDatas && answers.numberOfLastGames

    logSeparation()
    console.log(`\n \t \t \t \t    Nombre de joueurs correspondant aux critères de recherche : ${players.length} \n \n`.bold)

    if (displayAdditionalDatas) {
      processResults.computeAdditionnalDatas(players, answers.numberOfLastGames)
      displayTable = new Table(createTableCharacteristicsAdditionalDatas(answers.numberOfLastGames))
    } else {
      displayTable = new Table(tableCharacteristics)
    }

    processResults.sortPlayers(players, answers)

    // Keeping only players to display
    players = players.slice(0, answers.numberOfPlayerToDisplay)

    let rank = 1
    players.forEach(player => {
      processResults.cleanAndEnhancePlayerDatas(player, rank)
      processResults.pushPlayerDatas(player, displayTable, displayAdditionalDatas)
      rank++
    })
    resolve(displayTable)
  })

  return createDisplayTable
}

module.exports = {
  processDbResults
}
