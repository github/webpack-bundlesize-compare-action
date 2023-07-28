import type {StatsCompilation} from 'webpack'
import {assetNameToSizeMap} from './name-to-size-map'
import type {WebpackStatsDiff, Sizes} from './types'
import {webpackStatsDiff} from './webpack-stats-diff'

export function getStatsDiff(
  oldAssetStats: Pick<StatsCompilation, 'assets'>,
  newAssetStats: Pick<StatsCompilation, 'assets'>
): WebpackStatsDiff<Sizes> {
  return webpackStatsDiff(
    assetNameToSizeMap(oldAssetStats.assets),
    assetNameToSizeMap(newAssetStats.assets)
  )
}
