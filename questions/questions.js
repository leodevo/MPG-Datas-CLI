const { constants } = require('./../constant')
const { isPositiveResponse } = require('./../tools/tools')

const sortingChoicesCommon =
[
  'Cote (croissant)',
  'Cote (décroissant)',
  'Note Moy.',
  'Nombre de buts',
  'Note Moy. (10 derniers matchs)'
]

const createSortingChoicesAdditionnalDatas = answers => {
  if (answers.numberOfLastGames) {
    return (
      [
        ...sortingChoicesCommon,
        `Note moy. (${answers.numberOfLastGames} derniers matchs)`
      ]
    )
  } else {
    return [...sortingChoicesCommon]
  }
}

const matchYesOrNo = (value) => {
  let pass = value.match(/^|o|oui|n|non/i) && (value.length <= 3)
  return pass ? true : 'Réponse invalide (O/N)'
}

const isPositiveResponseAdditionalDatas = response => {
  return isPositiveResponse(response.additionalDatas)
}

const validateCote = value => {
  let pass = value.match(/^[0-9]?[0-9]?[0-9]?$/i) && (value <= constants.COTE_MAX)
  return pass ? true : `Nombre invalide, entrez un chiffre entre 0 et ${constants.COTE_MAX}`
}

const validateTituAndSubsLast10games = value => {
  let pass = value.match(/^[0-9][0-9]?$/i) && (value <= 10)
  return pass ? true : `Nombre invalide, entrez un chiffre entre 0 et 10}`
}

const validateNumberOfLastGames = value => {
  let pass = value.match(/^[0-9][0-9]?$/i) && (value <= constants.NUMBER_OF_GAMES)
  return pass ? true : `Nombre invalide, entrez un chiffre entre 0 et ${constants.NUMBER_OF_GAMES}`
}

const validateNumberOfPlayerToDisplayer = value => {
  let pass = value.match(/^[0-9][0-9]?[0-9]?$/i) && (value <= constants.NUMBER_OF_PLAYER_DISPLAY_MAX)
  return pass ? true : `Nombre invalide, entrez un chiffre entre 0 et ${constants.NUMBER_OF_PLAYER_DISPLAY_MAX}`
}

const questions =
[{
  name: 'numberOfPlayerToDisplay',
  type: 'input',
  message: `Nombre max de joueurs à afficher ? MAX (${constants.NUMBER_OF_PLAYER_DISPLAY_MAX})`,
  default: constants.NUMBER_OF_PLAYER_DISPLAY_MAX.toString(),
  validate: validateNumberOfPlayerToDisplayer
}, {
  name: 'position',
  type: 'list',
  choices: ['G', 'D', 'M', 'A', 'Tous', 'Tous sauf G'], // Todo Mapping 'Gardien' -> 'G' etc
  message: 'Poste ?',
  default: 'Tous'
}, {
  name: 'tituAndSubsMin',
  type: 'input',
  message: `Nombre de titularisations + remplacements minimum ? (MAX ${constants.NUMBER_OF_GAMES})`,
  default: '0',
  validate: validateNumberOfLastGames
}, {
  name: 'tituAndSubsMinLast10games',
  type: 'input',
  message: `Nombre de titularisations + remplacements minimum pour les 10 derniers matchs? (MAX 10)`,
  default: '0',
  validate: validateTituAndSubsLast10games
}, {
  name: 'coteMax',
  type: 'input',
  message: `Cote MAX ? (${constants.COTE_MAX})`,
  default: constants.COTE_MAX.toString(),
  validate: validateCote
}, {
  name: 'additionalDatas',
  type: 'input',
  message: `Afficher des données supplémentaires ? (O/N)`,
  default: 'N',
  validate: matchYesOrNo
}, {
  when: isPositiveResponseAdditionalDatas,
  name: 'numberOfLastGames',
  message: `Combien de matchs les plus récents souhaitez-vous afficher la moyenne & le nombre de matchs jouées ? (MAX ${constants.NUMBER_OF_GAMES})`,
  default: '5',
  validate: validateNumberOfLastGames
}, {
  name: 'sorting', // TODO: choix titu ou titu+remplacements à ajouter
  type: 'list',
  choices: createSortingChoicesAdditionnalDatas,
  message: 'Trier par ... '
}]

const finalQuestion =
[{
  name: 'continue',
  type: 'input',
  message: `Continuer ? (O/N)`,
  default: 'N',
  validate: matchYesOrNo
}]

module.exports = { questions, finalQuestion }
