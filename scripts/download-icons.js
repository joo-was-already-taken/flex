import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECTS_PATH = path.join(__dirname, '../src/data/projects.json')
const SKILLS_PATH = path.join(__dirname, '../src/data/skills.json')
const ICONS_DIR = path.join(__dirname, '../public/icons/tech')

if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true })
}

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`))
          return
        }
        response.pipe(file)
        file.on('finish', () => {
          file.close(resolve)
        })
      })
      .on('error', (err) => {
        fs.unlink(dest, () => reject(err))
      })
  })
}

async function main() {
  const projects = JSON.parse(fs.readFileSync(PROJECTS_PATH, 'utf8'))
  const skills = JSON.parse(fs.readFileSync(SKILLS_PATH, 'utf8'))

  const projectSlugs = projects.flatMap((p) => p.techSlugs || [])
  const skillSlugs = skills.map((s) => s.slug).filter(Boolean)
  const slugs = [...new Set([...projectSlugs, ...skillSlugs])]

  console.log(`Syncing icons for: ${slugs.join(', ')}`)

  for (const slug of slugs) {
    const dest = path.join(ICONS_DIR, `${slug}.svg`)
    if (fs.existsSync(dest)) {
      console.log(`- ${slug}.svg already exists`)
      continue
    }

    const url = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`
    try {
      await download(url, dest)
      console.log(`✓ Downloaded ${slug}.svg`)
    } catch (err) {
      const fallbackUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-plain.svg`
      try {
        await download(fallbackUrl, dest)
        console.log(`Downloaded ${slug}.svg (plain)`)
      } catch (err2) {
        console.error(`Final failure for ${slug}`)
      }
    }
  }
}

main()
