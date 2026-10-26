# High-Stakes Party Poker Timer & Tournament Leaderboard

A fast-paced, luxury poker tournament timer and live synced leaderboard system built for a 70-guest party. Designed specifically for rotating table groups (heats) every 30–40 minutes with 1/2 starting blinds doubling every 7 minutes.

![Luxury Poker Table Aesthetic](https://img.shields.io/badge/Aesthetic-Midnight%20Emerald%20Felt-emerald)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Deploy](https://img.shields.io/badge/Deploy-Vercel%20Ready-blue)

---

## ♠ Features

1. **Exact 11-Level Blind Structure (Doubling Every 7m)**
   - Starts at 1/2, doubling every 7 minutes.
   - By Level 5 (28–35 min) and Level 6 (35–42 min), blinds hit 15/30 and 30/60, accelerating showdowns to guarantee games finish right within the 30–40 minute party turnover window.
2. **Instant QR Code Onboarding & Printable Table Stand**
   - **Printable Table Stand (`/print`)**: Clean, high-contrast, print-ready page formatted for paper table tents or acrylic stands. Guests can easily scan the QR code right off the table.
   - Guests scan the QR code with their phone camera, enter their name, and take their seat (Seats 1–10).
3. **Private Host / Dealer Headquarters (`/dealer` or `/host`)**
   - **Completely hidden from public navigation** so party guests cannot stumble upon or tamper with the timer.
   - Accessible only through the private direct link (`/dealer` or `/host`).
   - Touch controls: Start, Pause, Resume, Next Level, Prev Level, +1 Min, -1 Min.
   - 1-tap Knockout button: records exact knockout positions (8th, 7th... 2nd, 1st).
   - "Crown Winner" button: announces champion, triggers golden victory confetti, and auto-saves the heat result.
4. **Frame-Perfect Timestamp Sync for Vercel Subdomain**
   - Authoritative start timestamps calculate exact remaining seconds with client-side high-resolution clocks (`performance.now()`).
   - Zero clock drift, zero battery drain, and works smoothly across all 70 phones even on cellular data or party Wi-Fi.
5. **Party-Wide Tournament Leaderboard (`/leaderboard`)**
   - Win-count ranking: ranks guests across all heats by total victories (with 2nd place finishes as tie-breakers).
   - Golden podium for the party champions.
   - Complete heat history log.
6. **Cinema TV Display View (`/tv`)**
   - Fullscreen mode for a TV or projector mounted near the table.
   - Extra-large timer, current and next blinds, live seated players, and an embedded table QR code.
7. **Synthesized Casino Sound Engine (Web Audio API)**
   - 1-minute warning chime.
   - Level increase bell.
   - Winner victory fanfare.
   - Zero external audio files required; works reliably offline and mobile.

---

## 📈 Blind Structure (Doubling Every 7 Minutes)

| Level | Small Blind | Big Blind | Duration | Elapsed Time | Phase |
|:---:|:---:|:---:|:---:|:---:|:---|
| **1** | 1 | 2 | 7 min | 0:00 – 7:00 | Deep stacks; players settle in |
| **2** | 2 | 4 | 7 min | 7:00 – 14:00 | Normal play; feeling out opponents |
| **3** | 4 | 8 | 7 min | 14:00 – 21:00 | First pressure on short stacks |
| **4** | 8 | 16 | 7 min | 21:00 – 28:00 | Action picks up; first knockouts |
| **5** | 15 | 30 | 7 min | 28:00 – 35:00 | **Showdown zone (blinds 15×)** |
| **6** | 30 | 60 | 7 min | 35:00 – 42:00 | **All-in territory & table finale** |
| **7** | 50 | 100 | 7 min | 42:00 – 49:00 | Deep turbo push/fold |
| **8** | 100 | 200 | 7 min | 49:00 – 56:00 | Ultra turbo |
| **9** | 200 | 400 | 7 min | 56:00 – 63:00 | Extended turbo |
| **10** | 400 | 800 | 7 min | 63:00 – 70:00 | Championship speed |
| **11** | 800 | 1600 | 7 min | 70:00 – 77:00 | Final level |

---

## 🚀 Routes Overview

- `/` — **Guest Mobile View**: Clean timer, blinds display, and seat registration.
- `/print` — **Printable Table QR Sign**: Printable table stand / flyer to put on the poker table.
- `/tv` — **Big Screen View**: Fullscreen view for TV or projector.
- `/leaderboard` — **Party Leaderboard**: Standings across all heats.
- `/dealer` or `/host` — **Private Host Headquarters**: Dedicated dealer controls (hidden from public navigation).

---

## 🖨️ How to Print the Table QR Code

1. Navigate to `/print` (or click "Print Table Sign" inside any QR code popup).
2. Choose your layout:
   - **Sign / Acrylic**: Formatted for standard paper in an acrylic stand or taped to the table.
   - **Foldable Tent**: Formatted with a fold line in the center to stand directly on the felt.
3. Click **Print Now** (or press `Ctrl+P` / `Cmd+P`). The browser will automatically hide headers, backgrounds, and toolbars, printing a crisp, black-and-white or color table sign!
