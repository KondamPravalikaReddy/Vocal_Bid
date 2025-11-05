import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const useVoiceBidding = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognizedBid, setRecognizedBid] = useState<number | null>(null);

  const extractBidAmount = (text: string): number | null => {
    // Remove common words and extract numbers
    const cleanText = text.toLowerCase()
      .replace(/my bid is|i bid|bid|dollar|dollars|\$/g, '')
      .trim();
    
    // Try to extract number
    const numbers = cleanText.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      return parseInt(numbers[0], 10);
    }
    
    return null;
  };

  const startListening = useCallback(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      
      const bidAmount = extractBidAmount(transcript);
      if (bidAmount) {
        setRecognizedBid(bidAmount);
        toast.success(`Recognized bid: $${bidAmount}`);
      } else {
        toast.error('Could not recognize bid amount. Please try again.');
      }
      
      setIsListening(false);
    };

    recognition.onerror = () => {
      toast.error('Error recognizing speech. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
    toast.info('Listening... Say your bid amount');
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const resetBid = useCallback(() => {
    setTranscript('');
    setRecognizedBid(null);
  }, []);

  return {
    isListening,
    transcript,
    recognizedBid,
    startListening,
    stopListening,
    resetBid,
  };
};
