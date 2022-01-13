import {AssetDiff, WebpackStatsDiff} from './get-stats-diff'

function conditionalPercentage(number: number): string {
  if ([Infinity, -Infinity].includes(number)) {
    return '-'
  }

  const absValue = Math.abs(number)

  if ([0, 100].includes(absValue)) {
    return `${number}%`
  }

  const value = [0, 100].includes(absValue) ? absValue : absValue.toFixed(2)

  return `${signFor(number)}${value}%`
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

const TOTAL_HEADERS = makeHeader([
  'Files count',
  'Total bundle size',
  '% Changed'
])
const TABLE_HEADERS = makeHeader(['Asset', 'File Size', '% Changed'])

function signFor(num: number): '' | '+' | '-' {
  if (num === 0) return ''
  return num > 0 ? '+' : '-'
}
function toFileSizeDiff(asset: AssetDiff): string {
  return `${fileSizeIEC(asset.oldSize)} -> ${fileSizeIEC(
    asset.newSize
  )} (${signFor(asset.diff)}${fileSizeIEC(asset.diff)})`
}

function printAssetTableRow(asset: AssetDiff): string {
  return [
    asset.name,
    asset.diff === 0 ? fileSizeIEC(asset.newSize) : toFileSizeDiff(asset),
    conditionalPercentage(asset.diffPercentage)
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
  return `**Total**

${TOTAL_HEADERS}
${printAssetTableRow(statsDiff.total)}`
}

function fileSizeIEC(bytes: number, significantDigits = 2): string {
  if (bytes === 0) return '0 Bytes'

  const absBytes = Math.abs(bytes)
  const k = 1024
  const dm = significantDigits < 0 ? 0 : significantDigits
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(absBytes) / Math.log(k))

  return `${parseFloat((absBytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
