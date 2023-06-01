import {expect, test} from '@jest/globals'
import {getStatsDiff} from '../src/get-stats-diff'
import {getChunkModuleDiff} from '../src/get-chunk-module-diff'
import {
  printAssetTablesByGroup,
  printChunkModulesTable,
  printTotalAssetTable
} from '../src/print-markdown'
import {AssetDiff} from '../src/types'
import {readFile} from 'node:fs/promises'
import {resolve} from 'node:path'
import {StatsCompilation} from 'webpack'

async function readJsonFile(path: string): Promise<StatsCompilation> {
  const data = await readFile(resolve(__dirname, path), 'utf8')
  return JSON.parse(data)
}

test('Shows stats when files are removed', async () => {
  const statsDiff = getStatsDiff(
    await readJsonFile('./__mocks__/old-stats-assets.json'),
    await readJsonFile('./__mocks__/new-stats-assets.json')
  )

  expect(printTotalAssetTable(statsDiff)).toMatchSnapshot()
  expect(printAssetTablesByGroup(statsDiff)).toMatchSnapshot()
})

test('Shows stats when files are added', async () => {
  const statsDiff = getStatsDiff(
    await readJsonFile('./__mocks__/new-stats-assets.json'),
    await readJsonFile('./__mocks__/old-stats-assets.json')
  )

  expect(printTotalAssetTable(statsDiff)).toMatchSnapshot()
  expect(printAssetTablesByGroup(statsDiff)).toMatchSnapshot()
})

test('Shows stats when files are unchanged', async () => {
  const statsDiff = getStatsDiff(
    await readJsonFile('./__mocks__/old-stats-assets.json'),
    await readJsonFile('./__mocks__/old-stats-assets.json')
  )

  expect(printTotalAssetTable(statsDiff)).toMatchSnapshot()
  expect(printAssetTablesByGroup(statsDiff)).toMatchSnapshot()
})

test('Shows stats when files are hidden', async () => {
  const statsDiff = getStatsDiff(
    await readJsonFile('./__mocks__/old-hidden-stats-assets.json'),
    await readJsonFile('./__mocks__/new-hidden-stats-assets.json')
  )

  expect(printTotalAssetTable(statsDiff)).toMatchSnapshot()
  expect(printAssetTablesByGroup(statsDiff)).toMatchSnapshot()
})

test('computes the correct module diff information', async () => {
  const statsDiff = getChunkModuleDiff(
    await readJsonFile('./__mocks__/old-stats-with-chunks.json'),
    await readJsonFile('./__mocks__/new-stats-with-chunks.json')
  )

  expect(statsDiff?.added).toContainEqual({
    name: './src/client/this-file-was-added.ts',
    diff: 1496,
    diffPercentage: Infinity,
    new: {size: 1496, gzipSize: NaN},
    old: {size: 0, gzipSize: 0}
  } as AssetDiff)
  expect(statsDiff?.bigger).toContainEqual({
    name: './src/client/this-file-grew-larger.tsx',
    diff: 200,
    diffPercentage: 35.58719,
    new: {size: 762, gzipSize: NaN},
    old: {size: 562, gzipSize: NaN}
  } as AssetDiff)
  expect(statsDiff?.smaller).toContainEqual({
    name: './src/client/helpers/this-file-grew-smaller.ts',
    diff: -200,
    diffPercentage: -7.94281,
    new: {size: 2318, gzipSize: NaN},
    old: {size: 2518, gzipSize: NaN}
  } as AssetDiff)
  expect(statsDiff?.removed).toContainEqual({
    name: './src/client/this-file-will-be-deleted.ts',
    diff: -1496,
    diffPercentage: -100,
    new: {size: 0, gzipSize: 0},
    old: {size: 1496, gzipSize: NaN}
  } as AssetDiff)
  expect(statsDiff?.total.new).toEqual(statsDiff?.total.old)
  expect(statsDiff?.total.diff).toEqual(0)
  expect(statsDiff?.total.diffPercentage).toEqual(0)
})

test('displays module information when files are added/removed/changed', async () => {
  const statsDiff = getChunkModuleDiff(
    await readJsonFile('./__mocks__/old-stats-with-chunks.json'),
    await readJsonFile('./__mocks__/new-stats-with-chunks.json')
  )

  expect(printChunkModulesTable(statsDiff)).toMatchSnapshot()
})

test('displays no module information when unchanged', async () => {
  const statsDiff = getChunkModuleDiff(
    await readJsonFile('./__mocks__/old-stats-with-chunks.json'),
    await readJsonFile('./__mocks__/old-stats-with-chunks.json')
  )

  expect(printChunkModulesTable(statsDiff)).toMatchSnapshot()
})

test('does not display module information when it does not exist', async () => {
  const statsDiff = getChunkModuleDiff(
    await readJsonFile('./__mocks__/old-stats-assets.json'),
    await readJsonFile('./__mocks__/old-stats-assets.json')
  )

  expect(printChunkModulesTable(statsDiff)).toMatchSnapshot()
})
