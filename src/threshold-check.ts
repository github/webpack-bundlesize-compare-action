import * as core from '@actions/core'
import {WebpackStatsDiff} from './types'

export function totalSizeIncreasePercent(statsDiff: WebpackStatsDiff): number {
  if (statsDiff.total.old.size === 0) {
    return statsDiff.total.diff > 0 ? Infinity : 0
  }
  return (statsDiff.total.diff / statsDiff.total.old.size) * 100
}

export function shouldPostComment(
  statsDiff: WebpackStatsDiff,
  thresholdPercent?: string
): boolean {
  if (!thresholdPercent) {
    return true
  }

  const threshold = parseFloat(thresholdPercent)
  if (isNaN(threshold)) {
    core.warning(
      `Invalid total-increase-threshold-percent value: '${thresholdPercent}'. Ignoring threshold.`
    )
    return true
  }

  return totalSizeIncreasePercent(statsDiff) >= threshold
}
