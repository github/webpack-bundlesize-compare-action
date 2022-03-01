import type {StatsCompilation} from 'webpack'
import {nameToSizeMap} from './name-to-size-map'
import type {WebpackStatsDiff} from './types'
import {webpackStatsDiff} from './webpack-stats-diff'

export function getStatsDiff(
  oldAssetStats: Pick<StatsCompilation, 'assets'>,
  newAssetStats: Pick<StatsCompilation, 'assets'>
): WebpackStatsDiff {
  return webpackStatsDiff(
    nameToSizeMap(oldAssetStats.assets),
    nameToSizeMap(newAssetStats.assets)
  )
}
