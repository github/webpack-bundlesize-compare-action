import {expect, test} from '@jest/globals'
import {getStatsDiff} from '../src/get-stats-diff'
import {getChunkModuleDiff} from '../src/get-chunk-module-diff'
import {
  printAssetTablesByGroup,
  printChunkModulesTable,
  printTotalAssetTable
} from '../src/print-markdown'
import {AssetDiff} from '../src/types'

test('Shows stats when files are removed', () => {
  const statsDiff = getStatsDiff(
    require('./__mocks__/old-stats-assets.json'),
    require('./__mocks__/new-stats-assets.json')
  )

  expect(printTotalAssetTable(statsDiff)).toEqual(`**Total**

Files count | Type | Total bundle size | % Changed
----------- | ---- | ----------------- | ---------
7 -> 2 | bundled<br />gzip | 1.34 MB -> 1.29 MB (-53.65 KB)<br />386.44 KB -> N/A | -3.91%`)
  expect(printAssetTablesByGroup(statsDiff)).toEqual(`**Added**

No assets were added

**Removed**

Asset | Type | File Size | % Changed
----- | ---- | --------- | ---------
296.chunk.js | bundled<br />gzip | 124.57 KB -> 0 Bytes (-124.57 KB)<br />35.05 KB -> 0 Bytes | -100%
288.chunk.js | bundled<br />gzip | 57.24 KB -> 0 Bytes (-57.24 KB)<br />16.33 KB -> 0 Bytes | -100%
920.chunk.js | bundled<br />gzip | 54.98 KB -> 0 Bytes (-54.98 KB)<br />17.08 KB -> 0 Bytes | -100%
912.chunk.js | bundled<br />gzip | 44.37 KB -> 0 Bytes (-44.37 KB)<br />14.31 KB -> 0 Bytes | -100%
699.chunk.js | bundled<br />gzip | 26.39 KB -> 0 Bytes (-26.39 KB)<br />6.14 KB -> 0 Bytes | -100%

**Bigger**

Asset | Type | File Size | % Changed
----- | ---- | --------- | ---------
app.bundle.js | bundled<br />gzip | 1.04 MB -> 1.29 MB (+254.35 KB)<br />297.38 KB -> N/A | +23.91%

**Smaller**

Asset | Type | File Size | % Changed
----- | ---- | --------- | ---------
manifest.json | bundled<br />gzip | 551 Bytes -> 91 Bytes (-460 Bytes)<br />151 Bytes -> N/A | -83.48%

**Unchanged**

No assets were unchanged`)
})

test('Shows stats when files are added', () => {
  const statsDiff = getStatsDiff(
    require('./__mocks__/new-stats-assets.json'),
    require('./__mocks__/old-stats-assets.json')
  )

  expect(printTotalAssetTable(statsDiff)).toEqual(`**Total**

Files count | Type | Total bundle size | % Changed
----------- | ---- | ----------------- | ---------
2 -> 7 | bundled<br />gzip | 1.29 MB -> 1.34 MB (+53.65 KB)<br />N/A -> 386.44 KB | +4.07%`)
  expect(printAssetTablesByGroup(statsDiff)).toEqual(`**Added**

Asset | Type | File Size | % Changed
----- | ---- | --------- | ---------
296.chunk.js | bundled<br />gzip | 0 Bytes -> 124.57 KB (+124.57 KB)<br />0 Bytes -> 35.05 KB | -
288.chunk.js | bundled<br />gzip | 0 Bytes -> 57.24 KB (+57.24 KB)<br />0 Bytes -> 16.33 KB | -
920.chunk.js | bundled<br />gzip | 0 Bytes -> 54.98 KB (+54.98 KB)<br />0 Bytes -> 17.08 KB | -
912.chunk.js | bundled<br />gzip | 0 Bytes -> 44.37 KB (+44.37 KB)<br />0 Bytes -> 14.31 KB | -
699.chunk.js | bundled<br />gzip | 0 Bytes -> 26.39 KB (+26.39 KB)<br />0 Bytes -> 6.14 KB | -

**Removed**

No assets were removed

**Bigger**

Asset | Type | File Size | % Changed
----- | ---- | --------- | ---------
manifest.json | bundled<br />gzip | 91 Bytes -> 551 Bytes (+460 Bytes)<br />N/A -> 151 Bytes | +505.49%

**Smaller**

Asset | Type | File Size | % Changed
----- | ---- | --------- | ---------
app.bundle.js | bundled<br />gzip | 1.29 MB -> 1.04 MB (-254.35 KB)<br />N/A -> 297.38 KB | -19.29%

**Unchanged**

No assets were unchanged`)
})

test('Shows stats when files are unchanged', () => {
  const statsDiff = getStatsDiff(
    require('./__mocks__/old-stats-assets.json'),
    require('./__mocks__/old-stats-assets.json')
  )

  expect(printTotalAssetTable(statsDiff)).toEqual(`**Total**

Files count | Type | Total bundle size | % Changed
----------- | ---- | ----------------- | ---------
7 | bundled<br />gzip | 1.34 MB<br />386.44 KB | 0%`)
  expect(printAssetTablesByGroup(statsDiff)).toEqual(`**Added**

No assets were added

**Removed**

No assets were removed

**Bigger**

No assets were bigger

**Smaller**

No assets were smaller

**Unchanged**

Asset | Type | File Size | % Changed
----- | ---- | --------- | ---------
app.bundle.js | bundled<br />gzip | 1.04 MB<br />297.38 KB | 0%
296.chunk.js | bundled<br />gzip | 124.57 KB<br />35.05 KB | 0%
288.chunk.js | bundled<br />gzip | 57.24 KB<br />16.33 KB | 0%
920.chunk.js | bundled<br />gzip | 54.98 KB<br />17.08 KB | 0%
912.chunk.js | bundled<br />gzip | 44.37 KB<br />14.31 KB | 0%
699.chunk.js | bundled<br />gzip | 26.39 KB<br />6.14 KB | 0%
manifest.json | bundled<br />gzip | 551 Bytes<br />151 Bytes | 0%`)
})

test('computes the correct module diff information', () => {
  const statsDiff = getChunkModuleDiff(
    require('./__mocks__/old-stats-with-chunks.json'),
    require('./__mocks__/new-stats-with-chunks.json')
  )

  expect(statsDiff.added).toEqual([
    {
      name: './src/client/this-file-was-added.ts',
      diff: 1496,
      diffPercentage: Infinity,
      new: {size: 1496, gzipSize: NaN},
      old: {size: 0, gzipSize: 0}
    }
  ] as AssetDiff[])
  expect(statsDiff.bigger).toEqual([
    {
      name: './src/client/this-file-grew-larger.tsx',
      diff: 200,
      diffPercentage: 35.58719,
      new: {size: 762, gzipSize: NaN},
      old: {size: 562, gzipSize: NaN}
    }
  ] as AssetDiff[])
  expect(statsDiff.smaller).toEqual([
    {
      name: './src/client/helpers/this-file-grew-smaller.ts',
      diff: -200,
      diffPercentage: -7.94281,
      new: {size: 2318, gzipSize: NaN},
      old: {size: 2518, gzipSize: NaN}
    }
  ] as AssetDiff[])
  expect(statsDiff.removed).toEqual([
    {
      name: './src/client/this-file-will-be-deleted.ts',
      diff: -1496,
      diffPercentage: -100,
      new: {size: 0, gzipSize: 0},
      old: {size: 1496, gzipSize: NaN}
    }
  ] as AssetDiff[])
  expect(statsDiff.total.new).toEqual(statsDiff.total.old)
  expect(statsDiff.total.diff).toEqual(0)
  expect(statsDiff.total.diffPercentage).toEqual(0)
})

test('displays module information when files are added/removed/changed', () => {
  const statsDiff = getChunkModuleDiff(
    require('./__mocks__/old-stats-with-chunks.json'),
    require('./__mocks__/new-stats-with-chunks.json')
  )

  expect(printChunkModulesTable(statsDiff)).toEqual(`
**Changeset**

File | Size | % Changed
---- | ---- | ---------
./src/client/this-file-was-added.ts | 0 Bytes -> 1.46 KB (+1.46 KB) | -
./src/client/this-file-grew-larger.tsx | 562 Bytes -> 762 Bytes (+200 Bytes) | +35.59%
./src/client/helpers/this-file-grew-smaller.ts | 2.46 KB -> 2.26 KB (-200 Bytes) | -7.94%
./src/client/this-file-will-be-deleted.ts | 1.46 KB -> 0 Bytes (-1.46 KB) | -100%`)
})

test('displays no module information when unchanged', () => {
  const statsDiff = getChunkModuleDiff(
    require('./__mocks__/old-stats-with-chunks.json'),
    require('./__mocks__/old-stats-with-chunks.json')
  )

  expect(printChunkModulesTable(statsDiff)).toEqual(`No files were changed`)
})

test.todo('does not display module information when it does not exist')
