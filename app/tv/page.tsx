'use client';

import { useGameState } from '@/hooks/useGameState';
import TimerDisplay from '@/components/TimerDisplay';
import BlindsCard from '@/components/BlindsCard';
import PlayerRoster from '@/components/PlayerRoster';
import QrCodeModal from '@/components/QrCodeModal';
import CelebrationModal from '@/components/CelebrationModal';
import { Trophy, Crown, Users } from 'lucide-react';
import { useState } from 'react';

export default function TvPage() {
  const {
    currentHeat,
    currentLevel,
    nextLevel,
    remainingSeconds,
    leaderboard,
  } = useGameState();

  const [showCelebration, setShowCelebration] = useState(true);

  return (
    <div className="w-full min-h-[calc(100vh-60px)] p-4 sm:p-8 flex flex-col justify-between max-w-7xl mx-auto">
      {/* Top TV Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-felt-800 border-2 border-gold/40 flex items-center justify-center text-gold text-2xl shadow-glow-gold">
            ♠
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wider flex items-center gap-3">
              TABLE 1 • {currentHeat.name.toUpperCase()}
              <span className="text-xs font-sans font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-400">
              70 Guest Fast-Paced Turbo Heat • 7 Min Blinds
            </p>
          </div>
        </div>

        {/* Top 3 Party Leaders Banner */}
        {leaderboard.length > 0 && (
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/40 border border-gold/30">
            <Trophy className="w-4 h-4 text-gold" />
            <div className="text-xs">
              <span className="text-stone-400">Party Leaders: </span>
              {leaderboard.slice(0, 3).map((l, i) => (
                <span key={l.playerName} className="ml-2 font-bold text-stone-100">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {l.playerName} ({l.wins}W)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Big Screen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* Left Column: Huge Clock & Blinds (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Giant Timer Card */}
          <div className="felt-card-gold rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center border-2 border-gold/30 shadow-2xl relative overflow-hidden">
            <TimerDisplay
              remainingSeconds={remainingSeconds}
              totalDurationSeconds={currentLevel.durationSeconds}
              status={currentHeat.status}
              size="xl"
            />
          </div>

          {/* Large Blinds Card */}
          <BlindsCard currentLevel={currentLevel} nextLevel={nextLevel} />
        </div>

        {/* Right Column: Table Seating & Embedded Join QR Code (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Embedded QR Code for Table */}
          <QrCodeModal heatNumber={currentHeat.heatNumber} inline={true} />

          {/* Active Seated Table Players */}
          <PlayerRoster players={currentHeat.players} isDealer={false} />
        </div>
      </div>

      {/* Winner Celebration Modal */}
      {currentHeat.status === 'finished' && currentHeat.winnerName && (
        <CelebrationModal
          winnerName={currentHeat.winnerName}
          runnerUpName={currentHeat.runnerUpName}
          heatNumber={currentHeat.heatNumber}
          isOpen={showCelebration}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
}
