import type {StatsCompilation} from 'webpack'
import {readFile} from 'fs/promises'

export async function parseStatsFileToJson(
  statsFilePath: string
): Promise<Pick<StatsCompilation, 'assets'>> {
  try {
    const file = await readFile(statsFilePath, 'utf8')
    return JSON.parse(file) as StatsCompilation
  } catch {
    return {assets: []} as Pick<StatsCompilation, 'assets'>
  }
}
