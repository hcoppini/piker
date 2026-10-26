'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Tv, Smartphone, Shield, Volume2, VolumeX } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';

export default function Navbar() {
  const pathname = usePathname();
  const { currentHeat, isAudioMuted, toggleMute } = useGameState();

  // Public navigation links only — host/dealer link is hidden from public guests
  const links = [
    { href: '/', label: 'Player HUD', icon: Smartphone },
    { href: '/tv', label: 'TV Display', icon: Tv },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const isHostPage = pathname === '/dealer' || pathname === '/host';

  return (
    <header className="sticky top-0 z-50 border-b border-cardbg-border bg-felt-darkest/85 backdrop-blur-md px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Heat Status */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-felt-800 border border-gold/30 flex items-center justify-center text-gold shadow-glow-gold/20 group-hover:border-gold transition">
            <span className="font-display font-bold text-sm">♠</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm sm:text-base tracking-wider text-gold-200">
                POKER PARTY
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hidden xs:inline-block">
                Turbo
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <span
                className={`w-2 h-2 rounded-full ${
                  currentHeat.status === 'running'
                    ? 'bg-emerald-400 animate-pulse'
                    : currentHeat.status === 'paused'
                    ? 'bg-amber-400'
                    : 'bg-stone-500'
                }`}
              />
              <span className="text-[11px] font-medium">
                {currentHeat.name} • {currentHeat.players.filter((p) => p.status === 'active').length} Active
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-gold/20 text-gold-100 border border-gold/40 shadow-glow-gold/15'
                    : 'text-stone-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}

          {/* Show host indicator only if currently on the private host URL */}
          {isHostPage && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Host Mode</span>
            </span>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            title={isAudioMuted ? 'Unmute Casino Sounds' : 'Mute Sounds'}
            className="p-1.5 rounded-lg border border-white/10 hover:border-gold/40 text-stone-300 hover:text-gold transition ml-1"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-gold" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
