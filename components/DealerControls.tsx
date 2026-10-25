'use client';

import { useState } from 'react';
import { Heat, Player } from '@/lib/types';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Plus,
  Minus,
  Award,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface DealerControlsProps {
  heat: Heat;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onResetLevel: () => void;
  onNextLevel: () => void;
  onPrevLevel: () => void;
  onAdjustTime: (deltaSeconds: number) => void;
  onFinishHeat: (winnerName: string, runnerUpName?: string) => void;
  onStartNewHeat: () => void;
  onResetAll: () => void;
}

export default function DealerControls({
  heat,
  onStart,
  onPause,
  onResume,
  onResetLevel,
  onNextLevel,
  onPrevLevel,
  onAdjustTime,
  onFinishHeat,
  onStartNewHeat,
  onResetAll,
}: DealerControlsProps) {
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState('');
  const [selectedRunnerUp, setSelectedRunnerUp] = useState('');

  const isRunning = heat.status === 'running';
  const isFinished = heat.status === 'finished';

  const activePlayers = heat.players.filter((p) => p.status === 'active');

  const handleOpenFinishModal = () => {
    // If only 1 or 2 active players left, pre-select
    if (activePlayers.length === 1) {
      setSelectedWinner(activePlayers[0].name);
    } else if (activePlayers.length > 0) {
      setSelectedWinner(activePlayers[0].name);
      if (activePlayers.length > 1) {
        setSelectedRunnerUp(activePlayers[1].name);
      }
    }
    setShowFinishModal(true);
  };

  const handleConfirmFinish = () => {
    if (!selectedWinner.trim()) return;
    onFinishHeat(selectedWinner.trim(), selectedRunnerUp.trim());
    setShowFinishModal(false);
  };

  return (
    <div className="w-full felt-card-gold rounded-2xl p-4 sm:p-6 shadow-2xl relative">
      <div className="flex items-center justify-between pb-3 border-b border-gold/20 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-gold/20 text-gold flex items-center justify-center font-display font-bold text-sm border border-gold/40">
            ♠
          </span>
          <div>
            <h3 className="font-display font-bold text-base text-gold-100">
              Dealer Control Panel
            </h3>
            <p className="text-[11px] text-stone-400">
              Table Heat #{heat.heatNumber} • Direct Host Mode
            </p>
          </div>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gold/15 text-gold-300 border border-gold/30">
          Live Controls
        </span>
      </div>

      {/* Main Play/Pause Button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {isRunning ? (
          <button
            onClick={onPause}
            className="py-4 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-base transition flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50"
          >
            <Pause className="w-5 h-5 fill-white" />
            <span>PAUSE TIMER</span>
          </button>
        ) : (
          <button
            onClick={heat.status === 'paused' ? onResume : onStart}
            className="py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{heat.status === 'paused' ? 'RESUME TIMER' : 'START TOURNAMENT'}</span>
          </button>
        )}

        {/* Finish Tournament / Announce Winner */}
        <button
          onClick={handleOpenFinishModal}
          className="py-4 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-felt-darkest font-extrabold text-base transition flex items-center justify-center gap-2 shadow-glow-gold/30"
        >
          <Award className="w-5 h-5" />
          <span>CROWN WINNER</span>
        </button>
      </div>

      {/* Level Navigation and Adjustment Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <button
          onClick={onPrevLevel}
          disabled={heat.currentLevelIndex === 0}
          className="py-2.5 px-3 rounded-lg bg-felt-900 hover:bg-felt-800 disabled:opacity-40 text-stone-200 text-xs font-bold border border-white/10 transition flex items-center justify-center gap-1.5"
        >
          <SkipBack className="w-3.5 h-3.5" />
          <span>Prev Level</span>
        </button>

        <button
          onClick={onNextLevel}
          disabled={heat.currentLevelIndex >= 10}
          className="py-2.5 px-3 rounded-lg bg-felt-900 hover:bg-felt-800 disabled:opacity-40 text-stone-200 text-xs font-bold border border-white/10 transition flex items-center justify-center gap-1.5"
        >
          <span>Next Level</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onAdjustTime(-60)}
          className="py-2.5 px-3 rounded-lg bg-felt-900 hover:bg-felt-800 text-stone-200 text-xs font-bold border border-white/10 transition flex items-center justify-center gap-1"
        >
          <Minus className="w-3.5 h-3.5 text-amber-400" />
          <span>1 Min</span>
        </button>

        <button
          onClick={() => onAdjustTime(60)}
          className="py-2.5 px-3 rounded-lg bg-felt-900 hover:bg-felt-800 text-stone-200 text-xs font-bold border border-white/10 transition flex items-center justify-center gap-1"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>1 Min</span>
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onResetLevel}
          className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Current Level (7:00)</span>
        </button>

        <div className="flex items-center gap-2">
          {isFinished && (
            <button
              onClick={onStartNewHeat}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seat Next Group (Heat #{heat.heatNumber + 1})</span>
            </button>
          )}

          <button
            onClick={() => {
              if (confirm('Start next table group/heat now? Current heat will be saved to leaderboard.')) {
                onStartNewHeat();
              }
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium border border-white/10 transition"
          >
            + Next Heat
          </button>

          <button
            onClick={() => {
              if (confirm('DANGER: Reset the entire tournament and party leaderboard?')) {
                onResetAll();
              }
            }}
            title="Reset Tournament"
            className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Finish Heat & Crown Winner Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="felt-card-gold max-w-md w-full rounded-2xl p-6 shadow-2xl animate-scaleUp">
            <div className="text-center mb-4">
              <span className="inline-block p-3 rounded-full bg-gold/20 text-gold mb-2 border border-gold/40">
                <Award className="w-8 h-8" />
              </span>
              <h3 className="font-display font-bold text-xl text-gold-100">
                Crown Heat #{heat.heatNumber} Champion!
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                Select the winner to announce the victory, trigger the party fanfare, and update the party leaderboard!
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gold-200 mb-1">
                  🥇 1st Place Champion (Winner):
                </label>
                {heat.players.length > 0 ? (
                  <select
                    value={selectedWinner}
                    onChange={(e) => setSelectedWinner(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-felt-900 border border-gold/40 text-sm text-gold font-bold focus:outline-none"
                  >
                    <option value="">-- Choose Winner --</option>
                    {heat.players.map((p) => (
                      <option key={p.id} value={p.name}>
                        Seat {p.seat}: {p.name} {p.status === 'active' ? '(Still Active)' : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter Winner's Name"
                    value={selectedWinner}
                    onChange={(e) => setSelectedWinner(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-felt-900 border border-gold/40 text-sm text-gold font-bold focus:outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  🥈 2nd Place (Runner-up, optional tiebreaker):
                </label>
                {heat.players.length > 0 ? (
                  <select
                    value={selectedRunnerUp}
                    onChange={(e) => setSelectedRunnerUp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-felt-900 border border-white/20 text-sm text-stone-200 focus:outline-none"
                  >
                    <option value="">-- Choose Runner-Up --</option>
                    {heat.players
                      .filter((p) => p.name !== selectedWinner)
                      .map((p) => (
                        <option key={p.id} value={p.name}>
                          Seat {p.seat}: {p.name}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter Runner-up Name (optional)"
                    value={selectedRunnerUp}
                    onChange={(e) => setSelectedRunnerUp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-felt-900 border border-white/20 text-sm text-stone-200 focus:outline-none"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmFinish}
                disabled={!selectedWinner.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gold hover:bg-gold-bright text-felt-darkest font-bold text-xs transition disabled:opacity-50 shadow-glow-gold/40"
              >
                Confirm Victory! 🏆
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
