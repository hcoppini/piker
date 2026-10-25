'use client';

import { formatTime } from '@/lib/blinds';
import { HeatStatus } from '@/lib/types';
import { Play, Pause, AlertCircle, Award } from 'lucide-react';

interface TimerDisplayProps {
  remainingSeconds: number;
  totalDurationSeconds: number;
  status: HeatStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function TimerDisplay({
  remainingSeconds,
  totalDurationSeconds,
  status,
  size = 'md',
}: TimerDisplayProps) {
  const percentRemaining = Math.max(
    0,
    Math.min(100, (remainingSeconds / (totalDurationSeconds || 420)) * 100)
  );

  const isLowTime = remainingSeconds <= 60 && status === 'running';

  const timeClasses = {
    sm: 'text-3xl sm:text-4xl',
    md: 'text-5xl sm:text-6xl',
    lg: 'text-6xl sm:text-7xl md:text-8xl',
    xl: 'text-7xl sm:text-8xl md:text-9xl',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      {/* Status Pill */}
      <div className="mb-2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border bg-black/40 backdrop-blur-sm">
        {status === 'running' && (
          <span className="flex items-center gap-1.5 text-emerald-400 border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Play className="w-3 h-3 fill-emerald-400" />
            Level In Progress
          </span>
        )}
        {status === 'paused' && (
          <span className="flex items-center gap-1.5 text-amber-400 border-amber-500/30">
            <Pause className="w-3 h-3 fill-amber-400" />
            Timer Paused
          </span>
        )}
        {status === 'waiting' && (
          <span className="flex items-center gap-1.5 text-stone-400 border-stone-500/30">
            <AlertCircle className="w-3 h-3" />
            Seating Table • Waiting to Start
          </span>
        )}
        {status === 'finished' && (
          <span className="flex items-center gap-1.5 text-gold border-gold/40">
            <Award className="w-3 h-3" />
            Tournament Finished
          </span>
        )}
      </div>

      {/* Main Clock */}
      <div
        className={`font-tabular font-extrabold tracking-tight transition-colors duration-300 ${timeClasses} ${
          isLowTime
            ? 'text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse'
            : status === 'finished'
            ? 'text-gold drop-shadow-glow-gold'
            : 'text-emerald-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]'
        }`}
      >
        {formatTime(remainingSeconds)}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-sm mt-3 h-2 rounded-full bg-black/60 border border-white/10 overflow-hidden relative">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isLowTime
              ? 'bg-gradient-to-r from-amber-500 to-red-500'
              : 'bg-gradient-to-r from-felt-accent to-emerald-400'
          }`}
          style={{ width: `${percentRemaining}%` }}
        />
      </div>

      {/* Low Time Alert Tag */}
      {isLowTime && (
        <span className="mt-1.5 text-[11px] font-bold tracking-widest uppercase text-amber-400 animate-bounce">
          ⚠️ 1-Minute Blind Jump Warning
        </span>
      )}
    </div>
  );
}
