import { writeFile, mkdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECTS_PATH = path.join(__dirname, '../src/data/projects.json')
const SKILLS_PATH = path.join(__dirname, '../src/data/skills.json')
const ICONS_DIR = path.join(__dirname, '../public/icons/tech')

if (!existsSync(ICONS_DIR)) {
  await mkdir(ICONS_DIR, { recursive: true })
}

async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to get '${url}' (${res.status})`)
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))
}

async function main() {
  const projects = JSON.parse(await readFile(PROJECTS_PATH, 'utf8'))
  const { main: skills } = JSON.parse(await readFile(SKILLS_PATH, 'utf8'))

  const projectSlugs = projects.flatMap((p) => p.techSlugs || [])
  const skillSlugs = skills.map((s) => s.slug).filter(Boolean)
  const slugs = [...new Set([...projectSlugs, ...skillSlugs])]

  console.log(`Syncing icons for: ${slugs.join(', ')}`)

  for (const slug of slugs) {
    const dest = path.join(ICONS_DIR, `${slug}.svg`)
    if (existsSync(dest)) {
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
      } catch {
        console.error(`Final failure for ${slug}`)
      }
    }
  }
}

main()
