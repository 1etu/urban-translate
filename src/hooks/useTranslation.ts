import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { TranslationHistoryItem, TranslatedItem } from '@/types/translation'
import { translateText } from '@/lib/translator'
import urbaneeseDict from '@/data/urbaneeseDict'

export function useTranslation() {
  const [urbaneseText, setUrbaneseText] = useState('')
  const [letterCount, setLetterCount] = useState(0)
  const [translatedText, setTranslatedText] = useState('')
  const [isReversed, setIsReversed] = useState(false)
  const [history, setHistory] = useState<TranslationHistoryItem[]>([])
  const [shouldDelayTranslation, setShouldDelayTranslation] = useState(false)

  useEffect(() => {
    const letters = urbaneseText.replace(/\s/g, '').length
    setLetterCount(letters)
  }, [urbaneseText])

  useEffect(() => {
    if (shouldDelayTranslation) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const result = translateText(urbaneseText, isReversed)
      setTranslatedText(JSON.stringify(result))
      if (result && urbaneseText.trim()) {
        saveToHistory(urbaneseText, result)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [urbaneseText, isReversed, shouldDelayTranslation])

  const saveToHistory = (source: string, translated: TranslatedItem[]) => {
    if (!source.trim()) return

    const newHistoryItem: TranslationHistoryItem = {
      id: uuidv4(),
      sourceText: source,
      translatedText: translated.map(item => item.primary).join(''),
      timestamp: Date.now(),
      isReversed: isReversed
    }

    setHistory(prev => [newHistoryItem, ...prev])
  }

  const handleSwapLanguages = () => {
    setIsReversed(!isReversed)
    const currentInput = urbaneseText
    
    try {
      const parsedTranslation = JSON.parse(translatedText)
      const formattedTranslation = parsedTranslation.map((item: TranslatedItem) => item.primary).join('')
      setUrbaneseText(formattedTranslation)
    } catch {
      setUrbaneseText(translatedText)
    }
    setTranslatedText(currentInput)
  }

  const handleHistoryItemClick = (item: TranslationHistoryItem) => {
    setIsReversed(item.isReversed)
    setUrbaneseText(item.sourceText)
    setTranslatedText(item.translatedText)
  }

  const handleClearHistory = () => {
    setHistory([])
  }

  const handleRemoveHistoryItem = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id))
  }

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * urbaneeseDict.length);
    const randomEntry = urbaneeseDict[randomIndex];
    return randomEntry?.word || '';
  };

  const delayTranslation = () => {
    setShouldDelayTranslation(true)
    setTimeout(() => {
      setShouldDelayTranslation(false)
    }, 1000)
  }

  return {
    urbaneseText,
    setUrbaneseText,
    letterCount,
    translatedText,
    isReversed,
    history,
    handleSwapLanguages,
    handleHistoryItemClick,
    handleClearHistory,
    handleRemoveHistoryItem,
    getParsedTranslation: () => {
      try {
        return JSON.parse(translatedText)
      } catch {
        return []
      }
    },
    getRandomWord,
    delayTranslation,
  }
}
