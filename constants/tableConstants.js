
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

module.exports = {
  tableCharacteristics,
  createTableCharacteristicsAdditionalDatas
}
