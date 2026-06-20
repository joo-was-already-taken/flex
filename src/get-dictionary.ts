import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  pl: () => import('./dictionaries/pl.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default),
  tok: () => import('./dictionaries/tok.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

type Dictionary = Awaited<ReturnType<typeof dictionaries.en>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge(target: any, source: any): any {
  if (typeof target !== 'object' || target === null) return source
  if (typeof source !== 'object' || source === null) return target

  const output = { ...target }
  for (const key of Object.keys(source)) {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      if (key in target) {
        output[key] = deepMerge(target[key], source[key])
      } else {
        output[key] = source[key]
      }
    } else {
      output[key] = source[key]
    }
  }
  return output
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const baseDict = await dictionaries.en()
  if (locale === 'en') return baseDict

  const loadDictionary = dictionaries[locale]
  if (!loadDictionary) return baseDict

  const targetDict = await loadDictionary()
  return deepMerge(baseDict, targetDict) as Dictionary
}
