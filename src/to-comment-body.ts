import {
  printAssetTablesByGroup,
  printChunkModulesTable,
  printTotalAssetTable
} from './print-markdown'
import type {WebpackStatsDiff} from './types'

export function getIdentifierComment(key: string): string {
  return `<!--- bundlestats-action-comment${key ? ` key:${key}` : ''} --->`
}

export function getCommentBody(
  statsDiff: WebpackStatsDiff,
  chunkModuleDiff: WebpackStatsDiff | null,
  title: string
): string {
  return `
# Bundle Stats${title ? ` - ${title}` : ''}



${printTotalAssetTable(statsDiff)}
${chunkModuleDiff ? `${printChunkModulesTable(chunkModuleDiff)}\n` : ''}

${getIdentifierComment(title)}
`
}
