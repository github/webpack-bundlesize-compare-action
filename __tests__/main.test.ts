import getStatsDiff from '../src/get-stats-diff'
import {
  printAssetTablesByGroup,
  printTotalAssetTable
} from '../src/print-markdown'

import {test, expect} from '@jest/globals'

test('Shows stats when files are removed', () => {
  const statsDiff = getStatsDiff(
    require('./__mocks__/old-stats-assets.json'),
    require('./__mocks__/new-stats-assets.json')
  )

  expect(printTotalAssetTable(statsDiff)).toEqual(`**Total**

Files count | Total bundle size | % Changed
----------- | ----------------- | ---------
7 -> 2 | 1.34 MB -> 1.29 MB (-53.65 KB) | -3.91%`)
  expect(printAssetTablesByGroup(statsDiff)).toEqual(`**Added**

No assets were added

**Removed**

Asset | File Size | % Changed
----- | --------- | ---------
app.bundle.js.gz | 297.38 KB -> 0 Bytes (-297.38 KB) | -100%
296.chunk.js | 124.57 KB -> 0 Bytes (-124.57 KB) | -100%
288.chunk.js | 57.24 KB -> 0 Bytes (-57.24 KB) | -100%
920.chunk.js | 54.98 KB -> 0 Bytes (-54.98 KB) | -100%
912.chunk.js | 44.37 KB -> 0 Bytes (-44.37 KB) | -100%
296.chunk.js.gz | 35.05 KB -> 0 Bytes (-35.05 KB) | -100%
699.chunk.js | 26.39 KB -> 0 Bytes (-26.39 KB) | -100%
920.chunk.js.gz | 17.08 KB -> 0 Bytes (-17.08 KB) | -100%
288.chunk.js.gz | 16.33 KB -> 0 Bytes (-16.33 KB) | -100%
912.chunk.js.gz | 14.31 KB -> 0 Bytes (-14.31 KB) | -100%
699.chunk.js.gz | 6.14 KB -> 0 Bytes (-6.14 KB) | -100%
manifest.json.gz | 151 Bytes -> 0 Bytes (-151 Bytes) | -100%

**Bigger**

Asset | File Size | % Changed
----- | --------- | ---------
app.bundle.js | 1.04 MB -> 1.29 MB (+254.35 KB) | +23.91%

**Smaller**

Asset | File Size | % Changed
----- | --------- | ---------
manifest.json | 551 Bytes -> 91 Bytes (-460 Bytes) | -83.48%

**Unchanged**

No assets were unchanged`)
})

test('Shows stats when files are added', () => {
  const statsDiff = getStatsDiff(
    require('./__mocks__/new-stats-assets.json'),
    require('./__mocks__/old-stats-assets.json')
  )

  expect(printTotalAssetTable(statsDiff)).toEqual(`**Total**

Files count | Total bundle size | % Changed
----------- | ----------------- | ---------
2 -> 7 | 1.29 MB -> 1.34 MB (+53.65 KB) | +4.07%`)
  expect(printAssetTablesByGroup(statsDiff)).toEqual(`**Added**

Asset | File Size | % Changed
----- | --------- | ---------
app.bundle.js.gz | 0 Bytes -> 297.38 KB (+297.38 KB) | -
296.chunk.js | 0 Bytes -> 124.57 KB (+124.57 KB) | -
288.chunk.js | 0 Bytes -> 57.24 KB (+57.24 KB) | -
920.chunk.js | 0 Bytes -> 54.98 KB (+54.98 KB) | -
912.chunk.js | 0 Bytes -> 44.37 KB (+44.37 KB) | -
296.chunk.js.gz | 0 Bytes -> 35.05 KB (+35.05 KB) | -
699.chunk.js | 0 Bytes -> 26.39 KB (+26.39 KB) | -
920.chunk.js.gz | 0 Bytes -> 17.08 KB (+17.08 KB) | -
288.chunk.js.gz | 0 Bytes -> 16.33 KB (+16.33 KB) | -
912.chunk.js.gz | 0 Bytes -> 14.31 KB (+14.31 KB) | -
699.chunk.js.gz | 0 Bytes -> 6.14 KB (+6.14 KB) | -
manifest.json.gz | 0 Bytes -> 151 Bytes (+151 Bytes) | -

**Removed**

No assets were removed

**Bigger**

Asset | File Size | % Changed
----- | --------- | ---------
manifest.json | 91 Bytes -> 551 Bytes (+460 Bytes) | +505.49%

**Smaller**

Asset | File Size | % Changed
----- | --------- | ---------
app.bundle.js | 1.29 MB -> 1.04 MB (-254.35 KB) | -19.29%

**Unchanged**

No assets were unchanged`)
})

test('Shows stats when files are unchanged', () => {
  const statsDiff = getStatsDiff(
    require('./__mocks__/old-stats-assets.json'),
    require('./__mocks__/old-stats-assets.json')
  )

  expect(printTotalAssetTable(statsDiff)).toEqual(`**Total**

Files count | Total bundle size | % Changed
----------- | ----------------- | ---------
7 | 1.34 MB | 0%`)
  expect(printAssetTablesByGroup(statsDiff)).toEqual(`**Added**

No assets were added

**Removed**

No assets were removed

**Bigger**

No assets were bigger

**Smaller**

No assets were smaller

**Unchanged**

Asset | File Size | % Changed
----- | --------- | ---------
app.bundle.js | 1.04 MB | 0%
app.bundle.js.gz | 297.38 KB | 0%
296.chunk.js | 124.57 KB | 0%
296.chunk.js.gz | 35.05 KB | 0%
288.chunk.js | 57.24 KB | 0%
288.chunk.js.gz | 16.33 KB | 0%
920.chunk.js | 54.98 KB | 0%
920.chunk.js.gz | 17.08 KB | 0%
912.chunk.js | 44.37 KB | 0%
912.chunk.js.gz | 14.31 KB | 0%
699.chunk.js | 26.39 KB | 0%
699.chunk.js.gz | 6.14 KB | 0%
manifest.json | 551 Bytes | 0%
manifest.json.gz | 151 Bytes | 0%`)
})
