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

export type Sizes = {
  size: number
  gzipSize: number | null
}

export type WebpackStatsDiff = {
  added: AssetDiff[]
  removed: AssetDiff[]
  bigger: AssetDiff[]
  smaller: AssetDiff[]
  unchanged: AssetDiff[]
  total: AssetDiff
}
