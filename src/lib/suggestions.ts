import urbaneeseDict from '@/data/urbaneeseDict'

export const getSuggestions = (input: string): string[] => 
  !input ? [] : urbaneeseDict
    .filter(({ word }) => {
      const lowerWord = word.toLowerCase()
      const lowerInput = input.toLowerCase()
      return lowerWord.startsWith(lowerInput) && lowerWord !== lowerInput
    })
    .map(({ word }) => word)
    .slice(0, 5)
