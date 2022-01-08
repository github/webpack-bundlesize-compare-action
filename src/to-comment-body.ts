import {printAssetTablesByGroup, printTotalAssetTable} from './print-markdown'
import {WebpackStatsDiff} from './get-stats-diff'

const IDENTIFIER_COMMENT = '<!--- bundlestats-action-comment --->'

export function getCommentBody(statsDiff: WebpackStatsDiff): string {
  return `
# Bundle Stats

Hey there, this message comes from a github action that helps you and reviewers to understand how these changes affect the size of this project's bundle.

As this PR is updated, I'll keep you updated on how the bundle size is impacted.

${printTotalAssetTable(statsDiff)}

<details>
  <summary>View detailed bundle breakdown</summary>

  <div>
    ${printAssetTablesByGroup(statsDiff)}
  </div>
</details>

${IDENTIFIER_COMMENT}
`
}
