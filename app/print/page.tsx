'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, ArrowLeft, Smartphone, CheckCircle, ShieldAlert, Sparkles, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function PrintQrPage() {
  const [url, setUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [tableNumber, setTableNumber] = useState<string>('Table 1');
  const [format, setFormat] = useState<'stand' | 'tent'>('stand');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.origin);
    }
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#060e0a] text-stone-100 print:bg-white print:text-black">
      {/* Top Floating Action Bar (Hidden on Print) */}
      <div className="no-print sticky top-0 z-50 bg-felt-darkest/95 backdrop-blur-md border-b border-cardbg-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold border border-white/10 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>
            <div>
              <h1 className="font-display font-bold text-sm text-gold-200">
                Printable Table QR Sign
              </h1>
              <p className="text-[11px] text-stone-400">
                Formatted for letter / A4 paper & table acrylic stands
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-felt-900 border border-gold/30 text-xs text-gold font-bold focus:outline-none"
            >
              <option value="Table 1">Table 1</option>
              <option value="Table 2">Table 2</option>
              <option value="Main Table">Main Table</option>
              <option value="VIP Table">VIP Table</option>
              <option value="Final Table">Final Table</option>
            </select>

            <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10 text-xs">
              <button
                onClick={() => setFormat('stand')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  format === 'stand' ? 'bg-gold text-felt-darkest font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Sign / Acrylic
              </button>
              <button
                onClick={() => setFormat('tent')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  format === 'tent' ? 'bg-gold text-felt-darkest font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Foldable Tent
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-950/40"
            >
              <Printer className="w-4 h-4" />
              <span>Print Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Printable Area */}
      <div className="max-w-2xl mx-auto p-4 sm:p-8 print:p-0 print:max-w-none">
        {format === 'stand' ? (
          /* Single Page Sign (for acrylic frame, wall, or tabletop) */
          <div className="bg-[#0b1711] print:bg-white text-stone-100 print:text-black border-2 border-gold/60 print:border-4 print:border-black rounded-3xl print:rounded-2xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden print:shadow-none print:m-0">
            {/* Corner Poker Suits Decoration */}
            <div className="absolute top-4 left-4 text-gold/40 print:text-black text-2xl font-display font-bold">♠</div>
            <div className="absolute top-4 right-4 text-gold/40 print:text-black text-2xl font-display font-bold">♥</div>
            <div className="absolute bottom-4 left-4 text-gold/40 print:text-black text-2xl font-display font-bold">♦</div>
            <div className="absolute bottom-4 right-4 text-gold/40 print:text-black text-2xl font-display font-bold">♣</div>

            {/* Header */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 print:bg-black/5 text-gold-300 print:text-black border border-gold/40 print:border-black text-xs font-extrabold uppercase tracking-widest mb-2">
                <span>POKER NIGHT • 70 GUEST TURBO</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black tracking-wide text-white print:text-black">
                {tableNumber.toUpperCase()}
              </h2>
              <p className="text-sm sm:text-base font-semibold text-gold-200 print:text-stone-800 mt-1">
                Scan to Take Your Seat & View Live Blinds
              </p>
            </div>

            {/* QR Code Container */}
            <div className="my-6 inline-block p-4 sm:p-6 bg-white rounded-3xl border-4 border-gold print:border-4 print:border-black shadow-2xl print:shadow-none">
              {url ? (
                <QRCodeSVG
                  value={url}
                  size={240}
                  level="H"
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              ) : (
                <div className="w-[240px] h-[240px] bg-stone-100 flex items-center justify-center text-xs text-stone-400">
                  Loading QR Code...
                </div>
              )}
            </div>

            {/* Direct URL Box */}
            <div className="mb-6 max-w-md mx-auto p-2.5 rounded-xl bg-black/40 print:bg-stone-100 border border-gold/30 print:border-stone-400 text-xs flex items-center justify-center gap-2">
              <span className="font-mono font-bold text-stone-200 print:text-black text-sm">
                {url || 'Loading...'}
              </span>
              <button
                onClick={handleCopy}
                className="no-print p-1 rounded hover:bg-white/10 text-gold print:hidden"
                title="Copy URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Instructions Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gold/20 print:border-stone-300 text-left">
              <div className="p-3 rounded-xl bg-felt-900/60 print:bg-stone-50 border border-white/10 print:border-stone-200">
                <div className="font-display font-black text-gold print:text-black text-sm mb-0.5">
                  1. SCAN
                </div>
                <div className="text-[11px] text-stone-300 print:text-stone-700 leading-snug">
                  Open your camera app and scan this code.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-felt-900/60 print:bg-stone-50 border border-white/10 print:border-stone-200">
                <div className="font-display font-black text-gold print:text-black text-sm mb-0.5">
                  2. SEAT
                </div>
                <div className="text-[11px] text-stone-300 print:text-stone-700 leading-snug">
                  Enter your name to claim your seat at the table.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-felt-900/60 print:bg-stone-50 border border-white/10 print:border-stone-200">
                <div className="font-display font-black text-gold print:text-black text-sm mb-0.5">
                  3. PLAY
                </div>
                <div className="text-[11px] text-stone-300 print:text-stone-700 leading-snug">
                  Follow the 7-minute blind jumps & live countdown!
                </div>
              </div>
            </div>

            {/* Tournament Blind Schedule Quick Note */}
            <div className="mt-5 text-[11px] text-stone-400 print:text-stone-600 font-tabular">
              Blinds double every 7 mins (1/2 → 2/4 → 4/8 → 8/16 → 15/30...) • Fast-Paced Turbo
            </div>
          </div>
        ) : (
          /* Foldable Table Tent (Two identical panels with a fold line in middle) */
          <div className="space-y-6 print:space-y-0">
            {/* Front Panel (Inverted for tent fold if needed, or top/bottom) */}
            <div className="bg-[#0b1711] print:bg-white text-stone-100 print:text-black border-2 border-gold/60 print:border-2 print:border-black rounded-2xl p-6 text-center">
              <div className="text-xs uppercase font-extrabold tracking-widest text-gold print:text-black mb-1">
                POKER TOURNAMENT • {tableNumber.toUpperCase()}
              </div>
              <h3 className="text-2xl font-display font-extrabold text-white print:text-black mb-2">
                SCAN TO JOIN & VIEW BLINDS
              </h3>
              <div className="my-3 inline-block p-3 bg-white rounded-2xl border-2 border-gold print:border-2 print:border-black">
                {url && (
                  <QRCodeSVG
                    value={url}
                    size={170}
                    level="H"
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                )}
              </div>
              <div className="text-xs font-mono font-bold text-stone-300 print:text-black">
                {url}
              </div>
              <div className="text-[10px] text-stone-400 print:text-stone-600 mt-1">
                Open smartphone camera • 7-min blind doubling
              </div>
            </div>

            {/* Fold Guideline */}
            <div className="py-2 flex items-center justify-center gap-2 text-stone-500 print:text-stone-400 text-xs font-mono border-y border-dashed border-stone-600 print:border-stone-400 my-4">
              <span>✂ --- FOLD HERE TO STAND ON TABLE --- ✂</span>
            </div>

            {/* Back Panel */}
            <div className="bg-[#0b1711] print:bg-white text-stone-100 print:text-black border-2 border-gold/60 print:border-2 print:border-black rounded-2xl p-6 text-center">
              <div className="text-xs uppercase font-extrabold tracking-widest text-gold print:text-black mb-1">
                POKER TOURNAMENT • {tableNumber.toUpperCase()}
              </div>
              <h3 className="text-2xl font-display font-extrabold text-white print:text-black mb-2">
                SCAN TO JOIN & VIEW BLINDS
              </h3>
              <div className="my-3 inline-block p-3 bg-white rounded-2xl border-2 border-gold print:border-2 print:border-black">
                {url && (
                  <QRCodeSVG
                    value={url}
                    size={170}
                    level="H"
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                )}
              </div>
              <div className="text-xs font-mono font-bold text-stone-300 print:text-black">
                {url}
              </div>
              <div className="text-[10px] text-stone-400 print:text-stone-600 mt-1">
                Open smartphone camera • 7-min blind doubling
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Print Style Injection */}
      <style jsx global>{`
        @media print {
          header, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          @page {
            margin: 1cm;
            size: auto;
          }
        }
      `}</style>
    </div>
  );
}
