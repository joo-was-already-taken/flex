import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  pl: () => import('./dictionaries/pl.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default),
  tok: () => import('./dictionaries/tok.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const getDictionary = async (locale: Locale) => {
  const loadDictionary = dictionaries[locale] ?? dictionaries.en
  return loadDictionary()
}
