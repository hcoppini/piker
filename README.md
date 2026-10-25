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
2. **Instant QR Code Onboarding**
   - Guests scan the QR code displayed on the TV or table tablet with their phone camera.
   - Enters their name and takes their seat (Seats 1–10).
3. **Frame-Perfect Timestamp Sync for Vercel Subdomain**
   - Authoritative start timestamps calculate exact remaining seconds with client-side high-resolution clocks (`performance.now()`).
   - Zero clock drift, zero battery drain, and works smoothly across all 70 phones even on cellular data or party Wi-Fi.
4. **Host / Dealer Headquarters (`/dealer`)**
   - Direct private access for the dealer (no PIN friction).
   - Touch controls: Start, Pause, Resume, Next Level, Prev Level, +1 Min, -1 Min.
   - 1-tap Knockout button: records exact knockout positions (8th, 7th... 2nd, 1st).
   - "Crown Winner" button: announces champion, triggers golden victory confetti, and auto-saves the heat result.
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

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- `http://localhost:3000` — Player Mobile View (QR Landing)
- `http://localhost:3000/dealer` — Dealer / Host Controls
- `http://localhost:3000/tv` — Big Screen / Projector View
- `http://localhost:3000/leaderboard` — Party Standings & Heat History

---

## ☁️ Deploying to Vercel

1. Push this project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Party Poker Timer"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Deploy! Vercel will automatically build the Next.js app and assign a subdomain (e.g., `poker-night.vercel.app`).
4. *(Optional for high-scale multi-instance cloud deployments)*: Add free Upstash Redis credentials in Vercel Project Settings (`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`). If omitted, the app uses its high-performance in-memory and client-synced architecture.

---

## 🃏 Party Host Protocol

1. **Before the Party**:
   - Open `/tv` on the TV/iPad near the poker table.
   - Open `/dealer` on the host/dealer's phone.
2. **When Guests Sit Down (Every 30–40 Minutes)**:
   - Guests scan the QR code on the TV or dealer's phone.
   - They enter their name to register their seat.
   - The dealer taps **START TOURNAMENT**.
3. **During the Match**:
   - As players bust out, the dealer taps **Bust** next to their name.
   - The app gives gentle 1-minute audio warnings before blinds jump.
4. **Ending the Heat**:
   - When the final two showdown, the dealer taps **CROWN WINNER**.
   - Confetti & victory fanfare trigger, and the win is recorded to `/leaderboard`.
   - Dealer taps **+ Next Heat** to seat the next group!
