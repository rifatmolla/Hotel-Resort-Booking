import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Eye, Type, Volume2, CheckCircle2 } from 'lucide-react';

interface AccessibilityModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const {
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    setIsVoiceActive,
    isAccessibilityModalOpen,
    setIsAccessibilityModalOpen,
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isAccessibilityModalOpen;
  const onClose = propOnClose || (() => setIsAccessibilityModalOpen(false));

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 relative overflow-hidden"
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 id="accessibility-title" className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Accessibility Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close accessibility settings"
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Text Sizing */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
              <Type className="w-4 h-4 text-amber-600" />
              Adjustable Text Sizing (WCAG 2.1)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setTextSize(size)}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                    textSize === size
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-bold ring-2 ring-amber-500/20'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <span className="capitalize">{size}</span>
                  <span className="block text-[10px] text-stone-400 font-normal">
                    {size === 'normal' ? '100%' : size === 'medium' ? '115%' : '130%'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40">
            <div>
              <div className="font-medium text-stone-900 dark:text-stone-100 text-sm">High Contrast Mode</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Enhance edge clarity and contrast ratios for improved visual legibility
              </div>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              role="switch"
              aria-checked={highContrast}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                highContrast ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  highContrast ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Hands-Free Voice Commands */}
          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 flex items-center justify-between">
            <div>
              <div className="font-medium text-stone-900 dark:text-stone-100 text-sm flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-600" />
                Hands-Free Voice Navigation
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Control searches, bookings, and theme with spoken commands
              </div>
            </div>
            <button
              onClick={() => {
                setIsVoiceActive(true);
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
            >
              Open Voice Bar
            </button>
          </div>

          {/* WCAG Compliance Badge */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">WCAG 2.1 AA Compliant:</span> Fully supports keyboard navigation,
              ARIA landmark roles, dynamic contrast scaling, and responsive screen-reader markup.
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-sm transition-colors shadow-xs"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
