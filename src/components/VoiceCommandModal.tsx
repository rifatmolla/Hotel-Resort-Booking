import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, X, Sparkles, Volume2, Check } from 'lucide-react';

export const VoiceCommandModal: React.FC = () => {
  const { isVoiceActive, setIsVoiceActive, executeVoiceCommand } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Click microphone or pick a quick command');
  const [recentAction, setRecentAction] = useState<string | null>(null);

  useEffect(() => {
    let recognition: any = null;

    if (isVoiceActive && isListening && typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setStatusMessage('Listening for your voice command...');
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };

        recognition.onerror = () => {
          setStatusMessage('Could not hear audio. You can use the quick commands below.');
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          if (transcript) {
            handleExecute(transcript);
          }
        };

        try {
          recognition.start();
        } catch {
          setIsListening(false);
        }
      } else {
        setStatusMessage('Browser speech API unavailable. Select a quick voice command below:');
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
  }, [isVoiceActive, isListening]);

  if (!isVoiceActive) return null;

  const handleExecute = (cmdText: string) => {
    setTranscript(cmdText);
    const feedback = executeVoiceCommand(cmdText);
    setRecentAction(feedback);
    setStatusMessage(feedback);
    setTimeout(() => {
      // Auto close after successful command execution feedback
      setIsVoiceActive(false);
      setRecentAction(null);
      setTranscript('');
    }, 1800);
  };

  const sampleCommands = [
    'Search Tokyo',
    'Show last minute deals',
    'Go to my bookings',
    'Toggle dark mode',
    'Open concierge chat',
    'View loyalty rewards',
    'Explore resorts',
    'Offline maps',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
    >
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-center relative overflow-hidden">
        <button
          onClick={() => setIsVoiceActive(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          aria-label="Close voice navigation"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Volume2 className="w-3.5 h-3.5" />
            Hands-Free Accessibility Navigation
          </div>
        </div>

        <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-1">
          Voice Assistant
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-6">
          Speak naturally or tap a shortcut to navigate seamlessly
        </p>

        {/* Mic Pulse Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsListening(!isListening)}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isListening
                ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-400/30'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30'
            }`}
          >
            {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
          </button>
        </div>

        <div className="min-h-12 flex flex-col items-center justify-center mb-6">
          {transcript ? (
            <div className="font-medium text-stone-800 dark:text-stone-200 text-sm italic bg-stone-100 dark:bg-stone-800/80 px-4 py-2 rounded-xl">
              "{transcript}"
            </div>
          ) : (
            <p className="text-xs text-stone-500 dark:text-stone-400">{statusMessage}</p>
          )}

          {recentAction && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in zoom-in-95">
              <Check className="w-3.5 h-3.5" />
              {recentAction}
            </div>
          )}
        </div>

        {/* Quick Voice Command Chips */}
        <div className="border-t border-stone-200 dark:border-stone-800 pt-4 text-left">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Spoken Commands
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleCommands.map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleExecute(cmd)}
                className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-amber-950/60 text-stone-700 dark:text-stone-300 text-xs transition-colors hover:text-amber-800 dark:hover:text-amber-200"
              >
                "{cmd}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
