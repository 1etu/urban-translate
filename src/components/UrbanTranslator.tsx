'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { ArrowLeftRight, Github, History, Keyboard, Mic } from 'lucide-react'
import TranslationHistory from '@/components/TranslationHistory'
import { useTranslation } from '@/hooks/useTranslation'
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition'
import { getSuggestions } from '../lib/suggestions'

export default function UrbanTranslate() {
  const {
    urbaneseText,
    setUrbaneseText,
    letterCount,
    isReversed,
    history,
    handleSwapLanguages,
    handleHistoryItemClick,
    handleClearHistory,
    handleRemoveHistoryItem,
    getParsedTranslation,
    getRandomWord,
  } = useTranslation()

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [isAutocompleteEnabled, setIsAutocompleteEnabled] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isShaking, setIsShaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault()
      const words = urbaneseText.split(/(\s+)/)
      const lastWord = words[words.length - 1]
      const completion = suggestion.slice(lastWord.length)
      setUrbaneseText(prev => prev + completion)
      setSuggestion(null)
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setUrbaneseText(newText);
    
    const words = newText.split(/(\s+)/);
    const lastWord = words[words.length - 1].trim();
    
    if (lastWord.length > 0 && isAutocompleteEnabled) {
      const newSuggestion = getSuggestions(lastWord);
      setSuggestion(newSuggestion[0] || null);
    } else {
      setSuggestion(null);
    }
  };

  const getDisplayText = () => {
    if (!suggestion || !isAutocompleteEnabled) return urbaneseText;
    
    const words = urbaneseText.split(/(\s+)/)
    const lastWord = words[words.length - 1].trim()
    if (suggestion.startsWith(lastWord)) {
      return urbaneseText + suggestion.slice(lastWord.length)
    }
    return urbaneseText
  }

  const handleTranscriptChange = (text: string) => {
    setUrbaneseText(prev => {
      const newText = prev ? `${prev} ${text}` : text;
      return newText.trim();
    });
  };

  const { isListening, startListening } = useVoiceRecognition({
    onTranscriptChange: handleTranscriptChange,
    isReversed
  });

  const handleRandomWord = () => {
    const word = getRandomWord();
    if (!word) return;
    
    setIsShaking(true);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
    
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
    
    document.documentElement.style.setProperty('--word-width', `${word.length}ch`);
    setUrbaneseText(word);
  };

  return (
    <div className={`flex flex-col min-h-screen bg-white ${isShaking ? 'shake-effect' : ''}`}>
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl cursor-default select-none">
          <span>
            <span style={{ color: '#4285F4' }}>U</span>
            <span style={{ color: '#EA4335' }}>r</span>
            <span style={{ color: '#FBBC05' }}>b</span>
            <span style={{ color: '#4285F4' }}>a</span>
            <span style={{ color: '#34A853' }}>n</span>
          </span>{' '}
          <span className="text-gray-500 text-2xş">Translate</span>
        </h1>
        <div className="flex items-center space-x-4">
          <a href="https://github.com/etulastrada/urban-translate" target="_blank" rel="noopener noreferrer">
            <Github className="w-6 h-6 text-gray-600 cursor-pointer" />
          </a>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start pt-8 px-8">
        <div className="w-full max-w-5xl flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-blue-500 font-medium pb-1 border-b-2 border-blue-500 cursor-default select-none">
              {isReversed ? 'English' : 'Urbaneese'}
            </span>

            
            
            <button 
              className="text-gray-500 hover:text-gray-700 transition-colors"
              onClick={handleSwapLanguages}
            >
              <ArrowLeftRight className="h-6 w-6" />
            </button>
            
            <span className="text-blue-500 font-medium pb-1 border-b-2 border-blue-500 cursor-default select-none">
              {isReversed ? 'Urbaneese' : 'English'}
            </span>
          </div>

          <div className="flex space-x-6">
            <div className="w-1/2 relative">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  className="w-full h-80 p-4 border border-gray-300 rounded-md focus:outline-none resize-none text-2xl text-black absolute bg-transparent"
                  value={urbaneseText}
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                ></textarea>
                <div 
                  className={`w-full h-80 p-4 border border-gray-300 rounded-md resize-none text-2xl pointer-events-none`}
                  style={{ color: 'transparent' }}
                >
                  <span className={isTyping ? 'typing-effect' : ''}>{urbaneseText}</span>
                  <span className="text-gray-400">
                    {suggestion && isAutocompleteEnabled ? getDisplayText().slice(urbaneseText.length) : ''}
                  </span>
                </div>
                <button
                  className={`absolute left-3 bottom-3 p-2 rounded-full transition-colors ${
                    isListening ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  onClick={startListening}
                  title={isListening ? 'Click to stop recording' : 'Click to start voice input'}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <div className="absolute right-3 bottom-3 text-sm text-gray-500 cursor-default select-none">
                  {letterCount}/2400
                </div>
              </div>
              <div className="mt-2 flex justify-center">
                <button
                  onClick={handleRandomWord}
                  className="text-blue-500 hover:text-blue-700 transition-colors text-sm"
                >
                  I'm Feeling Urban
                </button>
              </div>
            </div>

            <div className="w-1/2 relative">
              <div className="w-full h-80 bg-gray-100 rounded-md overflow-hidden translated-text-container">
                <div className="h-full flex flex-col">
                  <div className="flex-grow p-4 text-2xl text-black opacity-transition">
                    {getParsedTranslation().map((item: { primary: string, alternatives: string[] }, index: number) => (
                      <span key={index}>{item.primary}</span>
                    ))}
                  </div>
                  {getParsedTranslation().some((item: { alternatives: string[] }) => item.alternatives.length > 0) && (
                    <>
                      <div className="w-full h-px bg-gray-300"></div>
                      <div className="p-4 text-gray-600">
                        <div className="text-sm font-medium mb-2">Alternative translations:</div>
                        {getParsedTranslation().map((item: { primary: string, alternatives: string[] }, index: number) => (
                          item.alternatives.length > 0 && (
                            <div key={index} className="mb-1">
                              <span className="text-gray-800">{item.primary}</span>
                              <span className="mx-2">→</span>
                              {item.alternatives.join(', ')}
                            </div>
                          )
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-8 mt-8">
          <div className="flex items-center space-x-8">
            <div className="flex flex-col items-center">
              <button 
                className="w-16 h-16 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors mb-2"
                onClick={() => setIsHistoryOpen(true)}
              >
                <History className="w-6 h-6 text-gray-600" />
              </button>
              <span className="text-sm text-gray-600 cursor-default select-none">History</span>
            </div>

            <div className="flex flex-col items-center">
              <button 
                className="w-16 h-16 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors mb-2"
                onClick={() => setIsAutocompleteEnabled(!isAutocompleteEnabled)}
              >
                <Keyboard className="w-6 h-6 text-gray-600" />
              </button>
              <span className="text-sm text-gray-600 cursor-default select-none">{isAutocompleteEnabled ? 'Hide suggestions' : 'Show suggestions'}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto pb-4">
          <p className="font-['Italianno'] text-4xl text-gray-400 cursor-default select-none">
            From da streets, to da screens
          </p>
          <p className="text-sm text-gray-400 cursor-default select-none text-center">
            Made with ❤️ by{' '}
            <span className="bg-gradient-to-r from-purple-500 via-purple-300 to-purple-800 text-transparent bg-clip-text">
              etulastrada
            </span>
          </p>
        </div>
      </main>

      <TranslationHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onHistoryItemClick={(item) => {
          handleHistoryItemClick(item)
          setIsHistoryOpen(false)
        }}
        onClearHistory={handleClearHistory}
        onRemoveHistoryItem={handleRemoveHistoryItem}
      />
    </div>
  )
}
