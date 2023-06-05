import {StatsCompilation} from 'webpack'
import type {Sizes} from './types'

export function assetNameToSizeMap(
  statAssets: StatsCompilation['assets'] = []
): Map<string, Sizes> {
  return new Map(
    statAssets
      // when Webpack's stats.excludeAssets is used, assets which are excluded will be grouped into an asset with type 'hidden assets'
      .filter(it => !!it.name && it.type !== 'hidden assets')
      .map(asset => {
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

export function chunkModuleNameToSizeMap(
  statChunks: StatsCompilation['chunks'] = []
): Map<string, Sizes> {
  return new Map(
    statChunks.flatMap(chunk => {
      if (!chunk.modules) return []
      return chunk.modules.flatMap(module => {
        // If a module doesn't have any submodules beneath it, then just return its own size
        // Otherwise, break each module into its submodules with their own sizes
        if (module.modules) {
          return module.modules.map(submodule => [
            submodule.name ?? '',
            {
              size: submodule.size ?? 0,
              gzipSize: null
            }
          ])
        } else {
          return [
            [
              module.name ?? '',
              {
                size: module.size ?? 0,
                gzipSize: null
              }
            ]
          ]
        }
      })
    })
  )
}
