import React from 'react';
import { CardItem } from '../types/game';
import { Heart, Sparkles } from 'lucide-react';

interface CardProps {
  card: CardItem;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  disabled: boolean;
  stageNum: number;
}

export const Card: React.FC<CardProps> = ({
  card,
  isFlipped,
  isMatched,
  onClick,
  disabled,
  stageNum
}) => {
  const showFront = isFlipped || isMatched;

  // Visual card front design: vibrant, positive, and clear on mobile screens
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isMatched || isFlipped}
      style={{ perspective: '1000px' }}
      className={`relative w-full aspect-[4/5] sm:aspect-square rounded-2xl select-none transition-transform duration-200 active:scale-95 focus:outline-none ${
        disabled && !isMatched ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      aria-label={showFront ? card.label : '뒤집기 카드'}
    >
      <div
        className={`w-full h-full relative transition-transform duration-500 rounded-2xl shadow-sm ${
          showFront ? '[transform:rotateY(180deg)]' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back (Hidden state) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl flex flex-col items-center justify-center p-2 border-2 transition-all ${
            isMatched
              ? 'opacity-0 pointer-events-none'
              : 'bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 border-amber-300/80 shadow-md shadow-orange-500/10'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white shadow-inner mb-1">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-100 animate-pulse" />
          </div>
          <span className="text-[10px] sm:text-xs font-black text-white/90 tracking-wider">
            미니유
          </span>
        </div>

        {/* Card Front (Revealed state) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl flex flex-col items-center justify-center p-1.5 sm:p-2.5 border-2 text-center transition-all ${
            isMatched
              ? 'bg-amber-100/90 border-amber-400 ring-2 ring-amber-400/40 scale-[0.98]'
              : 'bg-white border-amber-300 shadow-md'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Matched badge */}
          {isMatched && (
            <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 text-[9px] sm:text-[10px] bg-amber-500 text-white font-black px-1.5 py-0.2 rounded-full shadow-xs">
              ✓ 짝!
            </span>
          )}

          {/* Emoji */}
          <div className="text-2xl sm:text-3xl md:text-4xl mb-0.5 sm:mb-1 drop-shadow-sm select-none transform transition-transform group-hover:scale-110">
            {card.emoji}
          </div>

          {/* Label */}
          <div className="text-xs sm:text-sm font-extrabold text-slate-800 leading-tight tracking-tight line-clamp-1">
            {card.label}
          </div>

          {/* Cheer Phrase */}
          <div className="text-[9px] sm:text-[11px] font-medium text-amber-700/90 line-clamp-1 mt-0.5 leading-snug">
            {card.cheerPhrase}
          </div>
        </div>
      </div>
    </button>
  );
};
