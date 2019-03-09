const { Player } = require('./models/player')
let { mongoose } = require('./db/mongoose')

const getPlayerLocal = (searchCriterias) => {
  return Player.find(searchCriterias)
}

const closeConnectionLocal = () => {
  return mongoose.connection.close()
}

const startLocalScript = () => {
  return mongoose.connect('mongodb://localhost:27017/MPG', { useNewUrlParser: true })
}

const computeSearchCriteriasLocal = (answers) => {
  let searchCriterias = {
    tituAndSubs: { $gte: answers.min_tituAndSubs },
    tituAndSubsLast10games: { $gte: answers.min_tituAndSubsLast10games },
    cote: { $lte: answers.max_cote }
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

module.exports = {
  computeSearchCriteriasLocal,
  closeConnectionLocal,
  getPlayerLocal,
  startLocalScript
}
