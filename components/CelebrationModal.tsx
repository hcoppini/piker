'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Crown, Sparkles, X } from 'lucide-react';
import Link from 'next/link';

interface CelebrationModalProps {
  winnerName: string;
  runnerUpName?: string;
  heatNumber: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function CelebrationModal({
  winnerName,
  runnerUpName,
  heatNumber,
  isOpen,
  onClose,
}: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger golden confetti burst
      try {
        const duration = 2.5 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#dfb461', '#f4d078', '#2ecc71', '#ffffff'],
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#dfb461', '#f4d078', '#2ecc71', '#ffffff'],
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      } catch {
        // Fallback if canvas-confetti is not loaded
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="felt-card-gold max-w-md w-full rounded-3xl p-6 sm:p-8 text-center relative shadow-2xl border-2 border-gold animate-scaleUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Trophy Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/20 text-gold border-2 border-gold/50 mb-3 shadow-glow-gold animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-gold-300 mb-1">
          <Sparkles className="w-4 h-4 text-gold" />
          <span>Heat #{heatNumber} Champion</span>
          <Sparkles className="w-4 h-4 text-gold" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide drop-shadow-lg mb-2">
          {winnerName}
        </h2>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mb-4">
          <Crown className="w-3.5 h-3.5 text-gold" />
          <span>Heat Victory Recorded!</span>
        </div>

        {runnerUpName && (
          <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 text-xs text-stone-300 mb-6">
            🥈 Runner-up: <strong className="text-white">{runnerUpName}</strong>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <Link
            href="/leaderboard"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-gold hover:bg-gold-bright text-felt-darkest font-bold text-xs transition shadow-glow-gold flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>View Party Leaderboard</span>
          </Link>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-semibold transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
