const BYTES_PER_KILOBYTE = 1024
const denominations = [
  'Bytes', // 1 Byte
  'KB', // 1 Kilobyte
  'MB', // 1 Megabyte
  'GB', // 1 Gigabyte
  'TB', // 1 Terabyte
  'PB', // 1 Petabyte
  'EB', // 1 Exabyte
  'ZB', // 1 Zettabyte
  'YB', // 1 Yottabyte
  'BB' // 1 brontobyte
]

/**
 * Prints a human readable file size.
 * with IEC units
 * @param bytes The file size in bytes.
 * @param precision The number of decimal places to show.
 */
export function fileSizeIEC(bytes: number | null, precision = 2): string {
  if (bytes == null || Number.isNaN(bytes)) {
    return 'N/A'
  }
  if (bytes === 0) return `0 ${denominations[0]}`

  const absBytes = Math.abs(bytes)

  const denominationIndex = Math.floor(
    Math.log(absBytes) / Math.log(BYTES_PER_KILOBYTE)
  )

  const value = parseFloat(
    (absBytes / Math.pow(BYTES_PER_KILOBYTE, denominationIndex)).toFixed(
      Math.max(0, precision)
    )
  )

  return `${value} ${denominations[denominationIndex]}`
}
