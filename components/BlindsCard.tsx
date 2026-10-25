'use client';

import { useState } from 'react';
import { BlindLevel } from '@/lib/types';
import { BLIND_LEVELS, formatChips } from '@/lib/blinds';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface BlindsCardProps {
  currentLevel: BlindLevel;
  nextLevel: BlindLevel | null;
  compact?: boolean;
}

export default function BlindsCard({
  currentLevel,
  nextLevel,
  compact = false,
}: BlindsCardProps) {
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Current Blinds Banner */}
      <div className="w-full felt-card rounded-2xl p-4 sm:p-6 text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

        {/* Level indicator */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-gold/20 text-gold-200 border border-gold/40">
            Level {currentLevel.level} of {BLIND_LEVELS.length}
          </span>
          <span className="text-xs text-stone-400">• 7 Min Rounds</span>
        </div>

        {/* Huge Current Blinds */}
        <div className="my-2 flex items-baseline justify-center gap-3">
          <div className="text-4xl sm:text-6xl font-black font-tabular tracking-tight text-white drop-shadow-md">
            {formatChips(currentLevel.smallBlind)}{' '}
            <span className="text-gold font-light">/</span>{' '}
            {formatChips(currentLevel.bigBlind)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-stone-400 font-medium tracking-wide">
          <span>
            Small Blind:{' '}
            <strong className="text-emerald-400 font-tabular font-bold">
              {formatChips(currentLevel.smallBlind)}
            </strong>
          </span>
          <span>•</span>
          <span>
            Big Blind:{' '}
            <strong className="text-gold-200 font-tabular font-bold">
              {formatChips(currentLevel.bigBlind)}
            </strong>
          </span>
        </div>

        {/* Next Level Preview */}
        <div className="mt-4 pt-3 border-t border-cardbg-border flex items-center justify-between text-xs">
          <span className="text-stone-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Next Level:
          </span>
          {nextLevel ? (
            <span className="font-semibold text-stone-200 font-tabular">
              {formatChips(nextLevel.smallBlind)} / {formatChips(nextLevel.bigBlind)}{' '}
              <span className="text-stone-400">(Lvl {nextLevel.level})</span>
            </span>
          ) : (
            <span className="text-gold font-semibold uppercase tracking-wider text-[11px]">
              Final Level
            </span>
          )}
        </div>

        {/* Toggle Schedule Button */}
        {!compact && (
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="mt-3 w-full py-1.5 text-xs text-stone-400 hover:text-gold flex items-center justify-center gap-1 transition rounded-lg hover:bg-white/5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showSchedule ? 'Hide Full Blind Schedule' : 'View All 11 Blind Levels'}</span>
            {showSchedule ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Accordion: Full 11-Level Blind Schedule */}
      {showSchedule && (
        <div className="w-full mt-2 felt-card rounded-xl p-3 border border-white/10 animate-fadeIn">
          <div className="text-xs font-bold uppercase tracking-wider text-gold-300 pb-2 border-b border-white/10 flex items-center justify-between">
            <span>Blind Structure (Doubling Every 7m)</span>
            <span>Duration</span>
          </div>
          <div className="divide-y divide-white/5 text-xs">
            {BLIND_LEVELS.map((lvl) => {
              const isCurrent = lvl.level === currentLevel.level;
              return (
                <div
                  key={lvl.level}
                  className={`py-2 px-2 flex items-center justify-between font-tabular transition rounded ${
                    isCurrent
                      ? 'bg-gold/15 text-gold-100 font-bold border-l-2 border-gold pl-2.5'
                      : 'text-stone-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-12 text-stone-400 text-[11px]">Lvl {lvl.level}</span>
                    <span className="text-sm">
                      {formatChips(lvl.smallBlind)} / {formatChips(lvl.bigBlind)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 text-[11px]">7 min</span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
