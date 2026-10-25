'use client';

import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import TimerDisplay from '@/components/TimerDisplay';
import BlindsCard from '@/components/BlindsCard';
import PlayerRoster from '@/components/PlayerRoster';
import DealerControls from '@/components/DealerControls';
import QrCodeModal from '@/components/QrCodeModal';
import CelebrationModal from '@/components/CelebrationModal';
import { ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DealerPage() {
  const {
    currentHeat,
    currentLevel,
    nextLevel,
    remainingSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetLevel,
    nextLevelAction,
    prevLevelAction,
    adjustTime,
    joinPlayer,
    removePlayer,
    knockoutPlayer,
    revivePlayer,
    finishHeat,
    startNewHeat,
    resetAll,
  } = useGameState();

  const [showCelebration, setShowCelebration] = useState(true);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
      {/* Dealer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gold/20 text-gold flex items-center justify-center border border-gold/40 shadow-glow-gold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-gold-100 flex items-center gap-2">
              Dealer Headquarters
              <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                Host Mode
              </span>
            </h1>
            <p className="text-xs text-stone-400">
              Live tournament controls for {currentHeat.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <QrCodeModal heatNumber={currentHeat.heatNumber} />
          <Link
            href="/tv"
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold border border-white/10 transition"
          >
            TV Display ↗
          </Link>
        </div>
      </div>

      {/* Dealer Control Box */}
      <DealerControls
        heat={currentHeat}
        onStart={startTimer}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onResetLevel={resetLevel}
        onNextLevel={nextLevelAction}
        onPrevLevel={prevLevelAction}
        onAdjustTime={adjustTime}
        onFinishHeat={(winner, runnerUp) => {
          finishHeat(winner, runnerUp);
          setShowCelebration(true);
        }}
        onStartNewHeat={startNewHeat}
        onResetAll={resetAll}
      />

      {/* Two Column Layout: Clock & Blinds on Left, Player Roster on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {/* Synchronized Timer Card */}
          <div className="felt-card rounded-2xl p-6 flex flex-col items-center justify-center">
            <TimerDisplay
              remainingSeconds={remainingSeconds}
              totalDurationSeconds={currentLevel.durationSeconds}
              status={currentHeat.status}
              size="md"
            />
          </div>

          {/* Current Blinds Card */}
          <BlindsCard currentLevel={currentLevel} nextLevel={nextLevel} />
        </div>

        {/* Player Roster with 1-tap Knockout */}
        <div className="flex flex-col gap-4">
          <PlayerRoster
            players={currentHeat.players}
            isDealer={true}
            onJoin={joinPlayer}
            onKnockout={knockoutPlayer}
            onRevive={revivePlayer}
            onRemove={removePlayer}
          />
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
