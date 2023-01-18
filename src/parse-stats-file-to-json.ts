import {createReadStream} from 'fs'
import {resolve} from 'path'
import {parseChunked} from '@discoveryjs/json-ext'
import type {StatsCompilation} from 'webpack'
import * as core from '@actions/core'

export async function parseStatsFileToJson(
  statsFilePath: string
): Promise<Pick<StatsCompilation, 'assets' | 'chunks'>> {
  try {
    const path = resolve(process.cwd(), statsFilePath)
    return (await parseChunked(createReadStream(path))) as StatsCompilation
  } catch (error) {
    if (error instanceof Error) {
      core.warning(error)
    }
    return {assets: [], chunks: undefined} as StatsCompilation
  }
}
