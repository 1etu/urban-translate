import urbaneeseDict from '@/data/urbaneeseDict'
import { TranslatedItem } from '@/types/translation'

export function translateText(text: string, isReversed: boolean): TranslatedItem[] {
  if (!text.trim()) { return [] }

  const words = text.split(/(\s+|[.,!?;])/g)
  
  return words.map(word => {
    if (!word.trim() || /[.,!?;]/.test(word)) {
      return { primary: word, alternatives: [] }
    }

    if (isReversed) {
      const entry = urbaneeseDict.find(entry => 
        entry.meaning.toLowerCase().split(/\s+/).includes(word.toLowerCase())
      )
      return { 
        primary: entry ? entry.word : word, 
        alternatives: [] 
      }
    } else {
      const entry = urbaneeseDict.find(entry => 
        entry.word.toLowerCase() === word.toLowerCase()
      )
      
      if (entry) {
        const meanings = entry.meaning.split(' or ').map(meaning => meaning.trim())
        return {
          primary: meanings[0],
          alternatives: meanings.slice(1)
        }
      }
      return { primary: word, alternatives: [] }
    }
  })
}
