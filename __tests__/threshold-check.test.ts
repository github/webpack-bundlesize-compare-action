import {expect, describe, test, jest, beforeEach} from '@jest/globals'
import {
  shouldPostComment,
  totalSizeIncreasePercent
} from '../src/threshold-check'
import {WebpackStatsDiff} from '../src/types'
import * as core from '@actions/core'

jest.mock('@actions/core')
const mockedCore = core as jest.Mocked<typeof core>

describe('totalSizeIncreasePercent', () => {
  test('calculates positive percentage increase correctly', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 50,
        diffPercentage: 10,
        old: {size: 500, gzipSize: 250},
        new: {size: 550, gzipSize: 275}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(totalSizeIncreasePercent(statsDiff)).toBe(10)
  })

  test('calculates negative percentage (decrease) correctly', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: -50,
        diffPercentage: -10,
        old: {size: 500, gzipSize: 250},
        new: {size: 450, gzipSize: 225}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(totalSizeIncreasePercent(statsDiff)).toBe(-10)
  })

  test('returns 0 when there is no change', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 0,
        diffPercentage: 0,
        old: {size: 500, gzipSize: 250},
        new: {size: 500, gzipSize: 250}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(totalSizeIncreasePercent(statsDiff)).toBe(0)
  })

  test('returns Infinity when old size is 0 and new size is positive', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 100,
        diffPercentage: Infinity,
        old: {size: 0, gzipSize: 0},
        new: {size: 100, gzipSize: 50}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(totalSizeIncreasePercent(statsDiff)).toBe(Infinity)
  })

  test('returns 0 when old size is 0 and diff is 0', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 0,
        diffPercentage: 0,
        old: {size: 0, gzipSize: 0},
        new: {size: 0, gzipSize: 0}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(totalSizeIncreasePercent(statsDiff)).toBe(0)
  })
})

describe('shouldPostComment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns true when no threshold is provided', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 50,
        diffPercentage: 10,
        old: {size: 500, gzipSize: 250},
        new: {size: 550, gzipSize: 275}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(shouldPostComment(statsDiff, undefined)).toBe(true)
    expect(mockedCore.warning).not.toHaveBeenCalled()
  })

  test('returns true when threshold is undefined', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 50,
        diffPercentage: 10,
        old: {size: 500, gzipSize: 250},
        new: {size: 550, gzipSize: 275}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(shouldPostComment(statsDiff)).toBe(true)
    expect(mockedCore.warning).not.toHaveBeenCalled()
  })

  test('returns true when increase is above threshold', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 50,
        diffPercentage: 10,
        old: {size: 500, gzipSize: 250},
        new: {size: 550, gzipSize: 275}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(shouldPostComment(statsDiff, '5')).toBe(true)
    expect(mockedCore.warning).not.toHaveBeenCalled()
  })

  test('returns true when increase equals threshold', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 50,
        diffPercentage: 10,
        old: {size: 500, gzipSize: 250},
        new: {size: 550, gzipSize: 275}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(shouldPostComment(statsDiff, '10')).toBe(true)
    expect(mockedCore.warning).not.toHaveBeenCalled()
  })

  test('returns false when increase is below threshold', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 50,
        diffPercentage: 10,
        old: {size: 500, gzipSize: 250},
        new: {size: 550, gzipSize: 275}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(shouldPostComment(statsDiff, '15')).toBe(false)
    expect(mockedCore.warning).not.toHaveBeenCalled()
  })

  test('returns false when size decreases (negative percentage)', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: -50,
        diffPercentage: -10,
        old: {size: 500, gzipSize: 250},
        new: {size: 450, gzipSize: 225}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(shouldPostComment(statsDiff, '5')).toBe(false)
    expect(mockedCore.warning).not.toHaveBeenCalled()
  })

  test('returns true when threshold is invalid (NaN) and logs warning', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 50,
        diffPercentage: 10,
        old: {size: 500, gzipSize: 250},
        new: {size: 550, gzipSize: 275}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(shouldPostComment(statsDiff, 'not-a-number')).toBe(true)
    expect(mockedCore.warning).toHaveBeenCalledWith(
      "Invalid total-increase-threshold-percent value: 'not-a-number'. Ignoring threshold."
    )
  })

  test('returns true when threshold is empty string (treated as no threshold)', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 50,
        diffPercentage: 10,
        old: {size: 500, gzipSize: 250},
        new: {size: 550, gzipSize: 275}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    // Empty string is falsy, so it's treated same as undefined
    expect(shouldPostComment(statsDiff, '')).toBe(true)
    expect(mockedCore.warning).not.toHaveBeenCalled()
  })

  test('handles threshold with decimal values', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 50,
        diffPercentage: 10,
        old: {size: 500, gzipSize: 250},
        new: {size: 550, gzipSize: 275}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(shouldPostComment(statsDiff, '9.5')).toBe(true)
    expect(shouldPostComment(statsDiff, '10.5')).toBe(false)
    expect(mockedCore.warning).not.toHaveBeenCalled()
  })

  test('returns true when increase is Infinity and threshold is set', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 100,
        diffPercentage: Infinity,
        old: {size: 0, gzipSize: 0},
        new: {size: 100, gzipSize: 50}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(shouldPostComment(statsDiff, '5')).toBe(true)
    expect(mockedCore.warning).not.toHaveBeenCalled()
  })

  test('handles zero threshold (always posts)', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: 1,
        diffPercentage: 0.2,
        old: {size: 500, gzipSize: 250},
        new: {size: 501, gzipSize: 251}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    expect(shouldPostComment(statsDiff, '0')).toBe(true)
    expect(mockedCore.warning).not.toHaveBeenCalled()
  })

  test('handles negative threshold values', () => {
    const statsDiff: WebpackStatsDiff = {
      total: {
        name: 'total',
        diff: -50,
        diffPercentage: -10,
        old: {size: 500, gzipSize: 250},
        new: {size: 450, gzipSize: 225}
      },
      added: [],
      removed: [],
      bigger: [],
      smaller: [],
      unchanged: []
    }

    // -10% >= -5% is false
    expect(shouldPostComment(statsDiff, '-5')).toBe(false)
    // -10% >= -15% is true
    expect(shouldPostComment(statsDiff, '-15')).toBe(true)
    expect(mockedCore.warning).not.toHaveBeenCalled()
  })
})
