import {AssetDiff, WebpackStatsDiff} from './get-stats-diff'

function conditionalPercentage(number: number): string {
  return [Infinity, -Infinity].includes(number) ? '-' : `${number.toFixed(2)}%`
}

function capitalize(text: string): string {
  return `${text[0].toUpperCase()}${text.slice(1)}`
}

function makeHeader(columns: readonly string[]): string {
  return `${columns.join(' | ')}
${columns
  .map(x =>
    Array.from(new Array(x.length))
      .map(() => '-')
      .join('')
  )
  .join(' | ')}`
}

const TABLE_HEADERS = makeHeader([
  'Asset',
  'Old size',
  'New size',
  'Diff',
  'Diff %'
])

function getSizeText(size: number): string {
  if (size === 0) {
    return '0'
  }

  const abbreviations = ['bytes', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(Math.abs(size)) / Math.log(1024))

  return `${+(size / Math.pow(1024, index)).toPrecision(3)} ${
    abbreviations[index]
  }`
}

function printAssetTableRow(asset: AssetDiff): string {
  return [
    asset.name,
    getSizeText(asset.oldSize),
    getSizeText(asset.newSize),
    getSizeText(asset.diff),
    `${conditionalPercentage(asset.diffPercentage)}`
  ].join(' | ')
}

export function printAssetTablesByGroup(
  statsDiff: Omit<WebpackStatsDiff, 'total'>
): string {
  const statsFields = [
    'added',
    'removed',
    'bigger',
    'smaller',
    'unchanged'
  ] as const
  return statsFields
    .map(field => {
      const assets = statsDiff[field]
      if (assets.length === 0) {
        return `**${capitalize(field)}**

No assets were ${field}`
      }

      return `**${capitalize(field)}**

${TABLE_HEADERS}
${assets
  .map(asset => {
    return printAssetTableRow(asset)
  })
  .join('\n')}`
    })
    .join('\n\n')
}

export function printTotalAssetTable(
  statsDiff: Pick<WebpackStatsDiff, 'total'>
): string {
  return `**${capitalize(statsDiff.total.name)}**

${TABLE_HEADERS}
${printAssetTableRow(statsDiff.total)}`
}
