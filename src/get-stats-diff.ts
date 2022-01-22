import type {StatsAsset, StatsCompilation} from 'webpack'

export type StatDiff = {
  newSize: number
  oldSize: number
  diff: number
  diffPercentage: number
}

type Sizes = {
  size: number
  related?: boolean
}

function getGzippedAsset(asset: StatsAsset): StatsAsset | undefined {
  if (asset.related && Array.isArray(asset.related)) {
    const gzippedAsset = asset.related.find(relatedAsset => {
      return relatedAsset.type === 'gzipped'
    })
    return gzippedAsset
  }
}

function indexNameToSize(
  statAssets: StatsCompilation['assets'] = []
): Record<string, Sizes> {
  const assets: Record<string, Sizes> = {}
  for (const asset of statAssets) {
    assets[asset.name] = {size: asset.size}
    const gzippedAsset = getGzippedAsset(asset)
    if (gzippedAsset) {
      assets[gzippedAsset.name] = {
        size: gzippedAsset.size,
        related: true
      }
    }
  }
  return assets
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

  for (const [name, {size: oldAssetSize, related}] of Object.entries(
    oldAssets
  )) {
    if (!related) {
      oldSizeTotal += oldAssetSize
    }

    if (!newAssets[name]) {
      removed.push({
        ...createDiff(oldAssetSize, 0),
        name
      })
    } else {
      const diff = {name, ...createDiff(oldAssetSize, newAssets[name].size)}

      if (diff.diffPercentage > 0) {
        bigger.push(diff)
      } else if (diff.diffPercentage < 0) {
        smaller.push(diff)
      } else {
        unchanged.push(diff)
      }
    }
  }

  for (const [name, {size: newAssetSize, related}] of Object.entries(
    newAssets
  )) {
    if (!related) {
      newSizeTotal += newAssetSize
    }
    if (!oldAssets[name]) {
      added.push({name, ...createDiff(0, newAssetSize)})
    }
  }

  const oldFilesCount = Object.values(oldAssets).filter(
    item => !item.related
  ).length
  const newFilesCount = Object.values(newAssets).filter(
    item => !item.related
  ).length
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
      ...createDiff(oldSizeTotal, newSizeTotal)
    }
  }
}

export default getStatsDiff
