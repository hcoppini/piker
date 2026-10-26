'use client';

import { useGameState } from '@/hooks/useGameState';
import LeaderboardTable from '@/components/LeaderboardTable';
import { Trophy, Crown, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const { leaderboard, completedHeats } = useGameState();

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-gold transition px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Table Timer</span>
        </Link>
      </div>

      {/* Podium Display (if at least 1 winner) */}
      {top1 && (
        <div className="felt-card-gold rounded-3xl p-6 sm:p-8 text-center border-2 border-gold/40 shadow-glow-gold relative overflow-hidden">
          <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-gold-300 mb-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>Party Tournament Leader</span>
            <Sparkles className="w-4 h-4 text-gold" />
          </div>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 text-gold border-2 border-gold mb-2 shadow-glow-gold">
            <Crown className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide">
            {top1.playerName}
          </h2>

          <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 text-gold-100 font-bold text-sm border border-gold/50">
            <span>🏆 {top1.wins} Heat {top1.wins === 1 ? 'Victory' : 'Victories'}</span>
            <span>•</span>
            <span className="text-stone-300 font-normal text-xs">{top1.totalHeatsPlayed} Heats Played</span>
          </div>

          {/* 2nd & 3rd Podium row */}
          {(top2 || top3) && (
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gold/20 max-w-sm mx-auto">
              {top2 && (
                <div className="p-3 rounded-xl bg-black/40 border border-slate-400/30 text-center">
                  <div className="text-sm font-bold text-slate-300">🥈 2nd Place</div>
                  <div className="text-sm font-display font-bold text-white truncate mt-0.5">
                    {top2.playerName}
                  </div>
                  <div className="text-[11px] text-stone-400 font-tabular mt-0.5">
                    {top2.wins} Wins • {top2.runnerUps} 2nds
                  </div>
                </div>
              )}
              {top3 && (
                <div className="p-3 rounded-xl bg-black/40 border border-amber-700/30 text-center">
                  <div className="text-sm font-bold text-amber-500">🥉 3rd Place</div>
                  <div className="text-sm font-display font-bold text-white truncate mt-0.5">
                    {top3.playerName}
                  </div>
                  <div className="text-[11px] text-stone-400 font-tabular mt-0.5">
                    {top3.wins} Wins • {top3.runnerUps} 2nds
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Leaderboard Table */}
      <LeaderboardTable leaderboard={leaderboard} completedHeats={completedHeats} />
    </div>
  );
}
