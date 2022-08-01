import type {StatsCompilation} from 'webpack'
import {chunkModuleNameToSizeMap} from './name-to-size-map'
import type {WebpackStatsDiff} from './types'
import {webpackStatsDiff} from './webpack-stats-diff'

export function getChunkModuleDiff(
  oldStats: Pick<StatsCompilation, 'chunks'>,
  newStats: Pick<StatsCompilation, 'chunks'>
): WebpackStatsDiff | null {
  if (!oldStats.chunks || !newStats.chunks) {
    return null
  }
  return webpackStatsDiff(
    chunkModuleNameToSizeMap(oldStats.chunks),
    chunkModuleNameToSizeMap(newStats.chunks)
  )
}
