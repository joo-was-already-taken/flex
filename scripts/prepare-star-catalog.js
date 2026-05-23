import { writeFile } from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const MAX_MAG = 10
const MAX_STARS = 1000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CATALOG_URL =
  'https://raw.githubusercontent.com/brettonw/YaleBrightStarCatalog/master/bsc5.json'
const OUTPUT_PATH = path.join(__dirname, '../public/stars.json')

async function downloadData() {
  const res = await fetch(CATALOG_URL)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  return res.json()
}

function prepareData(rawData) {
  console.log(`Processing ${rawData.length} entries...`)
  const stars = rawData
    .filter((raw) => raw.RA && raw.Dec && raw.Vmag)
    .map((raw) => {
      try {
        const raMatch = raw.RA.match(/(\d+)h\s*(\d+)m\s*([\d.]+)s/)
        if (!raMatch) return null
        const [, h, m, s] = raMatch.map(Number)
        const ra = (h + m / 60 + s / 3600) * (Math.PI / 12)

        const decMatch = raw.Dec.match(/([+-])(\d+)°\s*(\d+)′\s*([\d.]+)″/)
        if (!decMatch) return null
        const signStr = decMatch[1]
        const d = Number(decMatch[2])
        const dm = Number(decMatch[3])
        const ds = Number(decMatch[4])
        let decDeg = d + dm / 60 + ds / 3600
        if (signStr === '-') decDeg = -decDeg
        const dec = decDeg * (Math.PI / 180)

        const mag = parseFloat(raw.Vmag)
        if (isNaN(mag)) return null

        const star = {
          ra,
          dec,
          mag,
        }

        if (raw['B-V']) {
          const bv = parseFloat(raw['B-V'])
          if (!isNaN(bv)) {
            star.bv = bv
          }
        }

        return star
      } catch (e) {
        console.warn(`Failed to parse star: ${raw.HR || 'unknown'}`, e)
        return null
      }
    })
    .filter((s) => s !== null)
    .filter((star) => star.mag <= MAX_MAG)

  return stars
}

async function main() {
  const rawData = await downloadData()
  const stars = prepareData(rawData)
  stars.sort((a, b) => a.mag - b.mag)

  const finalStars = stars.slice(0, MAX_STARS)

  console.log(`Writing ${finalStars.length} stars to ${OUTPUT_PATH}...`)
  await writeFile(OUTPUT_PATH, JSON.stringify(finalStars))
  console.log('Done')
}

main()
