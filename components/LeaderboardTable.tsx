'use client';

import { useState } from 'react';
import { LeaderboardEntry, Heat } from '@/lib/types';
import { Trophy, Medal, Crown, Flame, Search, History } from 'lucide-react';

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
  completedHeats: Heat[];
}

export default function LeaderboardTable({
  leaderboard,
  completedHeats,
}: LeaderboardTableProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'standings' | 'history'>('standings');

  const filteredLeaderboard = leaderboard.filter((entry) =>
    entry.playerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full felt-card rounded-2xl p-4 sm:p-6 border border-gold/20 shadow-2xl">
      {/* Header and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cardbg-border mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold" />
            <h2 className="font-display font-bold text-lg text-gold-100">
              Party Poker Leaderboard
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Ranked by Heat Victories • Tie-broken by 2nd place finishes
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'standings'
                ? 'bg-gold text-felt-darkest shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Standings ({leaderboard.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-gold text-felt-darkest shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Heat History ({completedHeats.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'standings' ? (
        <>
          {/* Search Box */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
            <input
              type="text"
              placeholder="Search guest name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-felt-900 border border-white/10 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-gold"
            />
          </div>

          {/* Table */}
          {filteredLeaderboard.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-xs">
              <Trophy className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p>No tournament heats completed yet.</p>
              <p className="text-stone-500 mt-1">
                Once the host finishes Heat #1, rankings will appear here!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-stone-400">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Player</th>
                    <th className="py-2.5 px-3 text-center">Wins 🏆</th>
                    <th className="py-2.5 px-3 text-center">2nd 🥈</th>
                    <th className="py-2.5 px-3 text-center">Heats</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs font-tabular">
                  {filteredLeaderboard.map((entry, idx) => {
                    const rank = idx + 1;
                    return (
                      <tr
                        key={entry.playerName}
                        className={`hover:bg-white/5 transition ${
                          rank === 1
                            ? 'bg-gold/10 font-semibold'
                            : rank <= 3
                            ? 'bg-felt-800/40'
                            : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          {rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/20 text-gold border border-gold/40 font-bold">
                              🥇
                            </span>
                          ) : rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/40 font-bold">
                              🥈
                            </span>
                          ) : rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-500 border border-amber-600/40 font-bold">
                              🥉
                            </span>
                          ) : (
                            <span className="text-stone-400 pl-2">#{rank}</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-sm font-sans font-bold text-stone-100 flex items-center gap-1.5">
                            {entry.playerName}
                            {entry.wins > 0 && <Crown className="w-3.5 h-3.5 text-gold inline" />}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gold/20 text-gold-200 border border-gold/30">
                            {entry.wins}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center text-stone-300">
                          {entry.runnerUps}
                        </td>
                        <td className="py-3 px-3 text-center text-stone-400">
                          {entry.totalHeatsPlayed}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        /* Heat History Tab */
        <div className="space-y-3">
          {completedHeats.length === 0 ? (
            <div className="py-10 text-center text-stone-400 text-xs">
              No completed heats yet.
            </div>
          ) : (
            completedHeats.map((heat) => (
              <div
                key={heat.id}
                className="p-3.5 rounded-xl bg-felt-900 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-display font-bold text-gold">
                      Heat #{heat.heatNumber}
                    </span>
                    <span className="text-[11px] text-stone-400">• {heat.players.length} Players</span>
                  </div>
                  <div className="mt-1 text-sm font-bold text-stone-100 flex items-center gap-1.5">
                    <span>👑 Champion:</span>
                    <span className="text-gold-200">{heat.winnerName || 'Unknown'}</span>
                  </div>
                  {heat.runnerUpName && (
                    <div className="text-xs text-stone-400">
                      Runner-up: {heat.runnerUpName}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Completed
                  </span>
                  <div className="text-[10px] text-stone-500 mt-1 font-tabular">
                    Ended at Level {heat.currentLevelIndex + 1}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
