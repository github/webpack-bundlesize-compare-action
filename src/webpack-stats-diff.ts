import {getAssetDiff} from './get-asset-diff'
import {sortDiffDescending} from './sort-diff-descending'
import {Sizes, WebpackStatsDiff, isChunkSizes} from './types'

export function webpackStatsDiff<T extends Sizes>(
  oldAssets: Map<string, T>,
  newAssets: Map<string, T>
): WebpackStatsDiff<T> {
  const added = []
  const removed = []
  const bigger = []
  const smaller = []
  const unchanged = []

  let newSizeTotal = 0
  let oldSizeTotal = 0
  let newGzipSizeTotal = 0
  let oldGzipSizeTotal = 0

  let newSizeInitial = 0
  let oldSizeInitial = 0
  let newGzipSizeInitial = 0
  let oldGzipSizeInitial = 0
  let newInitialFilesCount = 0
  let oldInitialFilesCount = 0
  let hasInitialData = false

  for (const [name, oldAssetSizes] of oldAssets) {
    oldSizeTotal += oldAssetSizes.size
    oldGzipSizeTotal += oldAssetSizes.gzipSize ?? NaN
    if (isChunkSizes(oldAssetSizes) && oldAssetSizes.initial) {
      hasInitialData = true
      oldSizeInitial += oldAssetSizes.size
      oldGzipSizeInitial += oldAssetSizes.gzipSize ?? NaN
      oldInitialFilesCount += 1
    }
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
    if (isChunkSizes(newAssetSizes) && newAssetSizes.initial) {
      hasInitialData = true
      newSizeInitial += newAssetSizes.size
      newGzipSizeInitial += newAssetSizes.gzipSize ?? NaN
      newInitialFilesCount += 1
    }
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
        : `${oldFilesCount} -> ${newFilesCount}`,
      {size: oldSizeTotal, gzipSize: oldGzipSizeTotal},
      {size: newSizeTotal, gzipSize: newGzipSizeTotal}
    ),
    initial: hasInitialData
      ? getAssetDiff(
          oldInitialFilesCount === newInitialFilesCount
            ? `(initial only) ${newInitialFilesCount}`
            : `(initial only) ${oldInitialFilesCount} -> ${newInitialFilesCount}`,
          {size: oldSizeInitial, gzipSize: oldGzipSizeInitial},
          {size: newSizeInitial, gzipSize: newGzipSizeInitial}
        )
      : undefined
  } as WebpackStatsDiff<T>
}
