'use client';

import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import TimerDisplay from '@/components/TimerDisplay';
import BlindsCard from '@/components/BlindsCard';
import PlayerRoster from '@/components/PlayerRoster';
import QrCodeModal from '@/components/QrCodeModal';
import CelebrationModal from '@/components/CelebrationModal';
import { UserCheck, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PlayerPage() {
  const {
    currentHeat,
    currentLevel,
    nextLevel,
    remainingSeconds,
    joinPlayer,
  } = useGameState();

  const [playerName, setPlayerName] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<number>(1);
  const [hasJoinedLocally, setHasJoinedLocally] = useState(false);
  const [showCelebration, setShowCelebration] = useState(true);

  // Check if current user is already in players list
  const isPlayerSeated = currentHeat.players.some(
    (p) => p.name.toLowerCase() === playerName.trim().toLowerCase()
  );

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    joinPlayer(playerName.trim(), selectedSeat);
    setHasJoinedLocally(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
      {/* Table & Heat Title Banner */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-gold-300">
            Table 1 • 30–40m Turbo
          </span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide">
            {currentHeat.name}
          </h1>
        </div>
        <QrCodeModal heatNumber={currentHeat.heatNumber} />
      </div>

      {/* Guest Check-in Card (if not yet seated) */}
      {!hasJoinedLocally && !isPlayerSeated && currentHeat.status !== 'finished' && (
        <div className="felt-card-gold rounded-2xl p-4 sm:p-5 border-2 border-gold/40 shadow-glow-gold/20 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2 text-gold-200">
            <UserCheck className="w-5 h-5 text-gold" />
            <h2 className="font-display font-bold text-sm sm:text-base">
              Take Your Seat at the Table
            </h2>
          </div>
          <p className="text-xs text-stone-300 mb-3">
            Enter your name to register your seat for this 30-minute heat.
          </p>
          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Your Name (e.g. Alex M.)"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-felt-900 border border-gold/30 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-gold"
              required
            />
            <div className="flex items-center gap-2">
              <select
                value={selectedSeat}
                onChange={(e) => setSelectedSeat(Number(e.target.value))}
                className="px-3 py-2.5 rounded-xl bg-felt-900 border border-gold/30 text-sm text-gold font-bold focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                  <option key={s} value={s}>
                    Seat {s}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-bright text-felt-darkest font-extrabold text-sm transition shadow-glow-gold whitespace-nowrap"
              >
                Join Table ♠
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Synchronized Timer Clock */}
      <div className="felt-card rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center">
        <TimerDisplay
          remainingSeconds={remainingSeconds}
          totalDurationSeconds={currentLevel.durationSeconds}
          status={currentHeat.status}
          size="lg"
        />
      </div>

      {/* Current & Next Blinds Card */}
      <BlindsCard currentLevel={currentLevel} nextLevel={nextLevel} />

      {/* Active Table Roster */}
      <PlayerRoster players={currentHeat.players} isDealer={false} />

      {/* Footer link to party leaderboard */}
      <div className="pt-2 pb-6 text-center">
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gold-300 hover:text-gold hover:underline transition"
        >
          <Trophy className="w-4 h-4 text-gold" />
          <span>View Overall Party Standings & Leaderboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
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
