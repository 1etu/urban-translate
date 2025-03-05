'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Clock, Trash } from 'lucide-react'
import { TranslationHistoryProps } from '@/types/translation'

export default function TranslationHistory({
  isOpen,
  onClose,
  history,
  onHistoryItemClick,
  onClearHistory,
  onRemoveHistoryItem
}: TranslationHistoryProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleRemoveClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdownId(null);
    setTimeout(() => {
      onRemoveHistoryItem(id);
    }, 0);
  };

  return (
    <div
      className={`fixed right-0 top-0 h-full w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } z-50`}
      ref={panelRef}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-2xl font-normal text-gray-900">History</h2>
        <div className="flex items-center gap-4">
          <button
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            onClick={onClearHistory}
          >
            Clear all history
          </button>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100%-64px)]">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
            <Clock className="w-12 h-12 mb-4" />
            <p>No translation history yet</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => onHistoryItemClick(item)}
              className="hover:bg-gray-50 cursor-pointer border-b"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-gray-600">
                    {item.isReversed ? 'English → Urbaneese' : 'Urbaneese → English'}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={(e) => handleRemoveClick(e, item.id)}
                    >
                      <Trash className="w-5 h-5 mt-2" />
                    </button>
                  </div>
                </div>
                <div className="text-gray-900 mb-1">{item.sourceText}</div>
                <div className="text-gray-600">{item.translatedText}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
