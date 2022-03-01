import {StatsCompilation} from 'webpack'
import type {Sizes} from './types'

export function nameToSizeMap(
  statAssets: StatsCompilation['assets'] = []
): Map<string, Sizes> {
  return new Map(
    statAssets.map(asset => {
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
  )
}
