import type {StatsCompilation} from 'webpack'

export type StatDiff = {
  new: {
    size: number
    gzipSize: number | null
  }
  old: {
    size: number
    gzipSize: number | null
  }
  diff: number
  diffPercentage: number
}

export type Sizes = {
  size: number
  gzipSize: number | null
}

function indexNameToSize(
  statAssets: StatsCompilation['assets'] = []
): Record<string, Sizes> {
  const statsEntries = statAssets.map(asset => {
    let gzipSize: number | null = null
    if (asset.related && Array.isArray(asset.related)) {
      const gzipAsset = asset.related.find(
        related => related.type === 'gzipped'
      )
      if (gzipAsset) {
        gzipSize = gzipAsset.size
      }
    }

    return [
      asset.name,
      {
        size: asset.size,
        gzipSize
      }
    ]
  })
  return Object.fromEntries(statsEntries)
}

function diffDesc(diff1: StatDiff, diff2: StatDiff): number {
  return Math.abs(diff2.diff) - Math.abs(diff1.diff)
}

function createDiff(oldSize: Sizes, newSize: Sizes): StatDiff {
  return {
    new: {
      size: newSize.size,
      gzipSize: newSize.gzipSize ?? NaN
    },
    old: {
      size: oldSize.size,
      gzipSize: oldSize.gzipSize ?? NaN
    },
    diff: newSize.size - oldSize.size,
    diffPercentage: +((1 - newSize.size / oldSize.size) * -100).toFixed(5) || 0
  }
}

function getAssetsDiff(
  oldAssets: Record<string, Sizes>,
  newAssets: Record<string, Sizes>
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
  total: StatDiff & {
    name: string
  }
}

function webpackStatsDiff(
  oldAssets: Record<string, Sizes> = {},
  newAssets: Record<string, Sizes> = {}
): WebpackStatsDiff {
  const added = []
  const removed = []
  const bigger = []
  const smaller = []
  const unchanged = []

  let newSizeTotal = 0
  let oldSizeTotal = 0
  let newGzipSizeTotal = 0
  let oldGzipSizeTotal = 0

  for (const [name, oldAssetSizes] of Object.entries(oldAssets)) {
    oldSizeTotal += oldAssetSizes.size
    oldGzipSizeTotal += oldAssetSizes.gzipSize ?? NaN
    if (!newAssets[name]) {
      removed.push({
        ...createDiff(oldAssetSizes, {size: 0, gzipSize: 0}),
        name
      })
    } else {
      const diff = {
        name,
        ...createDiff(oldAssetSizes, newAssets[name])
      }

      if (diff.diffPercentage > 0) {
        bigger.push(diff)
      } else if (diff.diffPercentage < 0) {
        smaller.push(diff)
      } else {
        unchanged.push(diff)
      }
    }
  }

  for (const [name, newAssetSizes] of Object.entries(newAssets)) {
    newSizeTotal += newAssetSizes.size
    newGzipSizeTotal += newAssetSizes.gzipSize ?? NaN
    if (!oldAssets[name]) {
      added.push({
        name,
        ...createDiff({size: 0, gzipSize: 0}, newAssetSizes)
      })
    }
  }

  const oldFilesCount = Object.keys(oldAssets).length
  const newFilesCount = Object.keys(newAssets).length
  return {
    added: added.sort(diffDesc),
    removed: removed.sort(diffDesc),
    bigger: bigger.sort(diffDesc),
    smaller: smaller.sort(diffDesc),
    unchanged,
    total: {
      name:
        oldFilesCount === newFilesCount
          ? `${newFilesCount}`
          : `${oldFilesCount} -> ${newFilesCount}`,
      ...createDiff(
        {size: oldSizeTotal, gzipSize: oldGzipSizeTotal},
        {size: newSizeTotal, gzipSize: newGzipSizeTotal}
      )
    }
  }
}

export default getStatsDiff
