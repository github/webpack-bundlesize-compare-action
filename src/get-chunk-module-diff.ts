import type {StatsCompilation} from 'webpack'
import {chunkModuleNameToSizeMap} from './name-to-size-map'
import type {WebpackStatsDiff, ChunkSizes} from './types'
import {webpackStatsDiff} from './webpack-stats-diff'

export function getChunkModuleDiff(
  oldStats: Pick<StatsCompilation, 'chunks'>,
  newStats: Pick<StatsCompilation, 'chunks'>
): WebpackStatsDiff<ChunkSizes> | undefined {
  if (!oldStats.chunks || !newStats.chunks) {
    return undefined
  }
  return webpackStatsDiff(
    chunkModuleNameToSizeMap(oldStats.chunks),
    chunkModuleNameToSizeMap(newStats.chunks)
  )
}
