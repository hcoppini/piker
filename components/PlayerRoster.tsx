'use client';

import { useState } from 'react';
import { Player } from '@/lib/types';
import { Users, UserPlus, Skull, Undo2, X, Crown } from 'lucide-react';

interface PlayerRosterProps {
  players: Player[];
  isDealer?: boolean;
  onJoin?: (name: string, seat?: number) => void;
  onKnockout?: (playerId: string) => void;
  onRevive?: (playerId: string) => void;
  onRemove?: (playerId: string) => void;
}

export default function PlayerRoster({
  players,
  isDealer = false,
  onJoin,
  onKnockout,
  onRevive,
  onRemove,
}: PlayerRosterProps) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerSeat, setNewPlayerSeat] = useState<number>(1);
  const [showAddForm, setShowAddForm] = useState(false);

  const activePlayers = players.filter((p) => p.status === 'active');
  const bustedPlayers = players.filter((p) => p.status === 'busted');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim() || !onJoin) return;
    onJoin(newPlayerName.trim(), newPlayerSeat);
    setNewPlayerName('');
    setShowAddForm(false);
  };

  return (
    <div className="w-full felt-card rounded-2xl p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cardbg-border mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gold" />
          <h3 className="font-display font-bold text-sm tracking-wide text-stone-100">
            Table Seating
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-felt-700 text-emerald-300 font-bold border border-emerald-500/20 font-tabular">
            {activePlayers.length} Active • {players.length}/10 Seated
          </span>
        </div>

        {isDealer && onJoin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 border border-emerald-500/40 transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Seat Player</span>
          </button>
        )}
      </div>

      {/* Quick Add Player Form (for dealer) */}
      {showAddForm && isDealer && (
        <form onSubmit={handleAdd} className="mb-3 p-3 rounded-xl bg-black/40 border border-gold/30 flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Guest Name..."
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            className="flex-1 min-w-[140px] px-3 py-1.5 rounded-lg bg-felt-900 border border-white/10 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-gold"
            autoFocus
          />
          <div className="flex items-center gap-1.5 text-xs text-stone-300">
            <span>Seat:</span>
            <select
              value={newPlayerSeat}
              onChange={(e) => setNewPlayerSeat(Number(e.target.value))}
              className="px-2 py-1.5 rounded-lg bg-felt-900 border border-white/10 text-sm text-gold focus:outline-none focus:border-gold"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                <option key={s} value={s}>
                  Seat {s}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-gold text-felt-darkest font-bold text-xs hover:bg-gold-bright transition"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Empty State */}
      {players.length === 0 && (
        <div className="py-6 text-center text-stone-400 text-xs">
          <p>No players seated at this table yet.</p>
          <p className="mt-1 text-stone-500">
            Guests can scan the table QR code to take a seat!
          </p>
        </div>
      )}

      {/* Active Players Grid */}
      {players.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {players.map((p) => {
            const isBusted = p.status === 'busted';
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                  isBusted
                    ? 'bg-black/30 border-red-500/20 text-stone-500 opacity-60'
                    : 'bg-felt-900/60 border-white/10 text-stone-200 hover:border-gold/30'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-tabular ${
                      isBusted
                        ? 'bg-red-950 text-red-400'
                        : 'bg-felt-700 text-gold-200 border border-gold/30'
                    }`}
                  >
                    S{p.seat}
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-bold truncate flex items-center gap-1.5">
                      <span className={isBusted ? 'line-through text-stone-500' : 'text-stone-100'}>
                        {p.name}
                      </span>
                      {p.bustedPosition === 1 && (
                        <Crown className="w-3.5 h-3.5 text-gold inline" />
                      )}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {isBusted
                        ? `Knocked Out (${p.bustedPosition ? `${p.bustedPosition}${getOrdinal(p.bustedPosition)}` : 'Bust'})`
                        : 'In Contention'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-2">
                  {isDealer && !isBusted && onKnockout && (
                    <button
                      onClick={() => onKnockout(p.id)}
                      title="Mark Player Knocked Out"
                      className="px-2 py-1 rounded bg-red-900/40 hover:bg-red-800 text-red-300 border border-red-500/30 text-[11px] font-semibold flex items-center gap-1 transition"
                    >
                      <Skull className="w-3 h-3" />
                      <span>Bust</span>
                    </button>
                  )}

                  {isDealer && isBusted && onRevive && (
                    <button
                      onClick={() => onRevive(p.id)}
                      title="Undo Bust (Revive)"
                      className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-semibold flex items-center gap-1 transition"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>Undo</span>
                    </button>
                  )}

                  {isDealer && onRemove && (
                    <button
                      onClick={() => onRemove(p.id)}
                      title="Remove from table"
                      className="p-1 rounded text-stone-500 hover:text-red-400 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
