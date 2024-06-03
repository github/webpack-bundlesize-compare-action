import {
  printAssetTablesByGroup,
  printChunkModulesTable,
  printTotalAssetTable
} from './print-markdown'
import type {WebpackStatsDiff, DescribeAssetsOptions} from './types'

export function getIdentifierComment(key: string): string {
  return `<!--- bundlestats-action-comment${key ? ` key:${key}` : ''} --->`
}

export function getCommentBody(
  statsDiff: WebpackStatsDiff,
  chunkModuleDiff: WebpackStatsDiff | null,
  title: string,
  describeAssetsOptions: DescribeAssetsOptions
): string {
  return `
### Bundle Stats${title ? ` — ${title}` : ''}

Hey there, this message comes from a [GitHub action](https://github.com/github/webpack-bundlesize-compare-action) that helps you and reviewers to understand how these changes affect the size of this project's bundle.

As this PR is updated, I'll keep you updated on how the bundle size is impacted.

${printTotalAssetTable(statsDiff)}
${chunkModuleDiff ? `${printChunkModulesTable(chunkModuleDiff)}\n` : ''}
<details>
<summary>View detailed bundle breakdown</summary>

<div>

${printAssetTablesByGroup(statsDiff, describeAssetsOptions)}

</div>
</details>

${getIdentifierComment(title)}
`
}
