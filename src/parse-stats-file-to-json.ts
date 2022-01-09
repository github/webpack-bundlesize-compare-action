import type {StatsCompilation} from 'webpack'
import {readFile} from 'fs/promises'
import {resolve} from 'path'

export async function parseStatsFileToJson(
  statsFilePath: string
): Promise<Pick<StatsCompilation, 'assets'>> {
  try {
    const file = await readFile(resolve(process.cwd(), statsFilePath), 'utf8')
    console.log(file)
    return JSON.parse(file) as StatsCompilation
  } catch (e) {
    console.log(e)
    return {assets: []} as Pick<StatsCompilation, 'assets'>
  }
}
