import { useRef, useState } from 'react';

interface UseVoiceRecognitionProps {
  onTranscriptChange: (text: string) => void;
  isReversed: boolean;
}

export function useVoiceRecognition({ onTranscriptChange, isReversed }: UseVoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.abort();
    } finally {
      recognitionRef.current = null;
      setIsListening(false);
    }
  };

  const startListening = () => {
    if (isListening || recognitionRef.current) {
      stopListening();
      return;
    }

    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported');
      return;
    }

    try {
      const recognition = new (window as any).webkitSpeechRecognition();
      let finalTranscript = '';

      Object.assign(recognition, {
        continuous: false,
        interimResults: true,
        lang: 'en-US',
        
        onstart: () => {
          setIsListening(true);
          finalTranscript = '';
          setTimeout(() => recognition.stop(), 3000);
        },

        onend: () => {
          finalTranscript && onTranscriptChange(finalTranscript);
          recognitionRef.current = null;
          setIsListening(false);
        },

        onresult: ({ resultIndex, results }: any) => {
          let interim = '';
          for (let i = resultIndex; i < results.length; i++) {
            const transcript = results[i][0].transcript;
            results[i].isFinal 
              ? finalTranscript = transcript
              : interim += transcript;
          }
          interim && onTranscriptChange(interim);
        },

        onerror: ({ error }: any) => {
          error !== 'aborted' && console.error('Recognition error:', error);
          recognitionRef.current = null;
          setIsListening(false);
        }
      });

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      recognitionRef.current = null;
      setIsListening(false);
      alert('Recognition failed. Please retry.');
    }
  };

  return { isListening, startListening, stopListening };
}
