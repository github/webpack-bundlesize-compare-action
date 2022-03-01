import {AssetDiff, Sizes} from './types'

export function getAssetDiff(
  name: string,
  oldSize: Sizes,
  newSize: Sizes
): AssetDiff {
  return {
    name,
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
