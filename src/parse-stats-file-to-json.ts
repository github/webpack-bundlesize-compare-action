import type {StatsCompilation} from 'webpack'
import {readFile} from 'fs/promises'
import {resolve} from 'path'

export async function parseStatsFileToJson(
  statsFilePath: string
): Promise<Pick<StatsCompilation, 'assets'>> {
  try {
    const path = resolve(process.cwd(), statsFilePath)
    const file = await readFile(path, 'utf8')
    return JSON.parse(file) as StatsCompilation
  } catch {
    return {assets: []} as Pick<StatsCompilation, 'assets'>
  }
}
