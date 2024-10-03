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

export const describeAssetsSections = [
  'added',
  'removed',
  'bigger',
  'smaller',
  'unchanged'
] as const
export type DescribeAssetsSection = (typeof describeAssetsSections)[number]

export type DescribeAssetsOptions = Record<DescribeAssetsSection, boolean>

export const isDescribeAssetsSection = (
  option: string
): option is DescribeAssetsSection => {
  return describeAssetsSections.includes(option as DescribeAssetsSection)
}
