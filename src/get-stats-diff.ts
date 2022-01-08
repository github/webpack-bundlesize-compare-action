import type {StatsCompilation} from 'webpack'

export type StatDiff = {
  newSize: number
  oldSize: number
  diff: number
  diffPercentage: number
}
function indexNameToSize(
  statAssets: StatsCompilation['assets'] = []
): Record<string, number> {
  return Object.fromEntries(statAssets.map(({name, size}) => [name, size]))
}

function diffDesc(diff1: StatDiff, diff2: StatDiff): number {
  return Math.abs(diff2.diff) - Math.abs(diff1.diff)
}

function createDiff(oldSize: number, newSize: number): StatDiff {
  return {
    newSize,
    oldSize,
    diff: newSize - oldSize,
    diffPercentage: +((1 - newSize / oldSize) * -100).toFixed(5) || 0
  }
}

function getAssetsDiff(
  oldAssets: Record<string, number>,
  newAssets: Record<string, number>
): WebpackStatsDiff {
  return webpackStatsDiff(oldAssets, newAssets)
}

function getStatsDiff(
  oldAssetStats: Pick<StatsCompilation, 'assets'>,
  newAssetStats: Pick<StatsCompilation, 'assets'>
): WebpackStatsDiff {
  return getAssetsDiff(
    indexNameToSize(oldAssetStats.assets),
    indexNameToSize(newAssetStats.assets)
  )
}

export type AssetDiff = StatDiff & {
  name: string
}

export type WebpackStatsDiff = {
  added: AssetDiff[]
  removed: AssetDiff[]
  bigger: AssetDiff[]
  smaller: AssetDiff[]
  unchanged: AssetDiff[]
  total: StatDiff & {name: 'Total'}
}

function webpackStatsDiff(
  oldAssets: Record<string, number> = {},
  newAssets: Record<string, number> = {}
): WebpackStatsDiff {
  const added = []
  const removed = []
  const bigger = []
  const smaller = []
  const unchanged = []
  let newSizeTotal = 0
  let oldSizeTotal = 0

  for (const [name, oldAssetSize] of Object.entries(oldAssets)) {
    oldSizeTotal += oldAssetSize
    if (!newAssets[name]) {
      removed.push({
        ...createDiff(oldAssetSize, 0),
        name
      })
    } else {
      const diff = {name, ...createDiff(oldAssetSize, newAssets[name])}

      /**
       * Providing a small threshold for the diff to be considered "bigger"/"smaller"
       * to account for minor variance in webpack output for the same asset.
       */
      if (diff.diffPercentage > 5) {
        bigger.push(diff)
      } else if (diff.diffPercentage < -5) {
        smaller.push(diff)
      } else {
        unchanged.push(diff)
      }
    }
  }

  for (const [name, newAssetSize] of Object.entries(newAssets)) {
    newSizeTotal += newAssetSize
    if (!oldAssets[name]) {
      added.push({name, ...createDiff(0, newAssetSize)})
    }
  }

  return {
    added: added.sort(diffDesc),
    removed: removed.sort(diffDesc),
    bigger: bigger.sort(diffDesc),
    smaller: smaller.sort(diffDesc),
    unchanged,
    total: {name: 'Total', ...createDiff(oldSizeTotal, newSizeTotal)}
  }
}

export default getStatsDiff
