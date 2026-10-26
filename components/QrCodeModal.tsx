'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Copy, Check, Printer, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface QrCodeModalProps {
  heatNumber?: number;
  inline?: boolean;
}

export default function QrCodeModal({ heatNumber, inline = false }: QrCodeModalProps) {
  const [url, setUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(inline);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.origin);
    }
  }, []);

  const handleCopy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const content = (
    <div className="flex flex-col items-center text-center p-4">
      <div className="p-3 bg-white rounded-2xl shadow-xl mb-3 border-2 border-gold/40">
        {url ? (
          <QRCodeSVG
            value={url}
            size={180}
            level="H"
            includeMargin={true}
            fgColor="#060e0a"
            bgColor="#ffffff"
          />
        ) : (
          <div className="w-[180px] h-[180px] bg-stone-100 flex items-center justify-center text-xs text-stone-400">
            Generating QR...
          </div>
        )}
      </div>

      <h4 className="font-display font-bold text-base text-gold-200">
        Scan to Join Table
      </h4>
      <p className="text-xs text-stone-400 mt-0.5 max-w-xs">
        Open camera on your phone to access the live poker clock & blinds.
      </p>

      {/* Copy link bar */}
      <div className="mt-3 flex items-center gap-2 w-full max-w-xs bg-black/40 border border-white/10 rounded-lg p-1.5 text-xs">
        <span className="truncate flex-1 text-stone-300 font-mono text-[11px] px-1">
          {url || 'Loading...'}
        </span>
        <button
          onClick={handleCopy}
          className="px-2.5 py-1 rounded bg-gold/20 hover:bg-gold/30 text-gold-200 text-xs font-semibold flex items-center gap-1 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Printable Paper Sign Link */}
      <div className="mt-3 pt-3 border-t border-white/10 w-full max-w-xs flex justify-center">
        <Link
          href="/print"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Table Sign (Paper Stand) 🖨️</span>
        </Link>
      </div>
    </div>
  );

  if (inline) {
    return <div className="felt-card rounded-2xl border border-gold/20 p-2">{content}</div>;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-felt-800 hover:bg-felt-700 text-gold-200 border border-gold/30 text-xs font-semibold transition shadow-sm"
      >
        <QrCode className="w-4 h-4 text-gold" />
        <span>Table QR Code</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="felt-card max-w-sm w-full rounded-2xl border border-gold/30 p-5 relative animate-scaleUp">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-stone-400 hover:text-white text-xs font-bold p-1"
            >
              ✕
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
