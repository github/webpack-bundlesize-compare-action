export type AssetDiff = {
  name: string
  new: {
    size: number
    gzipSize: number | null
  }
  old: {
    size: number
    gzipSize: number | null
  }
  diff: number
  diffPercentage: number
}

export interface Sizes {
  size: number
  gzipSize: number | null
}

export interface ChunkSizes extends Sizes {
  initial: boolean
}

export function isChunkSizes(sizes: Sizes): sizes is ChunkSizes {
  return 'initial' in sizes
}

interface _WebpackStatsDiff {
  added: AssetDiff[]
  removed: AssetDiff[]
  bigger: AssetDiff[]
  smaller: AssetDiff[]
  unchanged: AssetDiff[]
  total: AssetDiff
  initial?: AssetDiff
}

export type WebpackStatsDiff<T extends Sizes> = T extends ChunkSizes
  ? _WebpackStatsDiff
  : Omit<_WebpackStatsDiff, 'initial'>
