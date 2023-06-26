import {getAssetDiff} from './get-asset-diff'
import {sortDiffDescending} from './sort-diff-descending'
import {Sizes, WebpackStatsDiff} from './types'

export function webpackStatsDiff(
  oldAssets: Map<string, Sizes>,
  newAssets: Map<string, Sizes>
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

  for (const [name, oldAssetSizes] of oldAssets) {
    oldSizeTotal += oldAssetSizes.size
    oldGzipSizeTotal += oldAssetSizes.gzipSize ?? NaN
    const newAsset = newAssets.get(name)
    if (!newAsset) {
      removed.push(getAssetDiff(name, oldAssetSizes, {size: 0, gzipSize: 0}))
    } else {
      const diff = getAssetDiff(name, oldAssetSizes, newAsset)

      if (diff.diffPercentage > 0) {
        bigger.push(diff)
      } else if (diff.diffPercentage < 0) {
        smaller.push(diff)
      } else {
        unchanged.push(diff)
      }
    }
  }

  for (const [name, newAssetSizes] of newAssets) {
    newSizeTotal += newAssetSizes.size
    newGzipSizeTotal += newAssetSizes.gzipSize ?? NaN
    const oldAsset = oldAssets.get(name)
    if (!oldAsset) {
      added.push(getAssetDiff(name, {size: 0, gzipSize: 0}, newAssetSizes))
    }
  }

  const oldFilesCount = oldAssets.size
  const newFilesCount = newAssets.size
  return {
    added: sortDiffDescending(added),
    removed: sortDiffDescending(removed),
    bigger: sortDiffDescending(bigger),
    smaller: sortDiffDescending(smaller),
    unchanged,
    total: getAssetDiff(
      oldFilesCount === newFilesCount
        ? `${newFilesCount}`
        : `${oldFilesCount} → ${newFilesCount}`,
      {size: oldSizeTotal, gzipSize: oldGzipSizeTotal},
      {size: newSizeTotal, gzipSize: newGzipSizeTotal}
    )
  }
}
