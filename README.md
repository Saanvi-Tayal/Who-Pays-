# 👑 Who Pays? — Party Dispute Resolution Game

> **Turn awkward bill splits, chores, and everyday dilemmas into frantic, high-stakes physical party games.**

---

## 📖 About the Project

**Who Pays?** is a fast-paced, local multiplayer party dispute resolution application built for groups of friends, colleagues, and roommates who are tired of awkward conversations about who picks up the check, takes out the trash, or gets aux cord privileges. Instead of pulling out a calculator or engaging in tedious polite debates, players place their fingers directly onto a single shared smartphone screen to immediately lock in their players, select their stakes, and settle the score through adrenaline-fueled party minigames.

The app tracks every outcome across distinct social circles—such as your **College Gang**, **Office Friends**, or **Flatmates**. Every decision feeds into a persistent **Karma Ledger**, dynamically awarding personality archetypes like **"The ATM"** (the perpetual loser) or **"The Lucky One"** (the friend who miraculously never pays). Players can toggle a mathematically weighted **Fairness Algorithm** that gently nudges probability against lucky players, or choose **Pure Chaos** for completely raw, unadulterated chance. Designed with an energetic retro-party aesthetic, rich micro-interactions, responsive haptic feedback, and fluid 60 FPS physics animations, *Who Pays?* transforms trivial everyday disputes into unforgettable social memories.

---

## 🎮 Game Modes (Arenas)

| Game Mode | Mechanics | Adrenaline Factor |
| :--- | :--- | :--- |
| **💣 Time Bomb** | A secret, randomized fuse scales with player count. Pass the phone frantically to the next player—whoever holds it when it detonates loses! | 🔥 High Suspense |
| **🎡 Russian Roulette** | A vibrant spinning wheel with decelerating cubic-bezier physics and real-time needle deflection that points directly at the unlucky payer. | 🎲 Pure Chance |
| **⚡ Tap Frenzy** | 5 seconds of furious tapping in your quadrant of the screen. The player with the fewest taps at zero pays the bill! | ⚡ High Octane |
| **🎯 Reaction Standoff** | All players press and hold their color pad. When the neon green flash strikes, release in milliseconds! False starts explode immediately. | ⏱️ Twitch Reflex |

---

## 👥 Social Circles & The Karma Ledger

- **Circle Isolation:** Keep work lunches and roommate groceries separate! Match histories, loss distributions, and player rosters are segregated per group (**College Gang 🎓**, **Office Friends 💼**, **Flatmates 🏠**, or create your own).
- **Dynamic Archetypes:**
  - 👑 **The ATM:** The group's most frequent payer.
  - 🍀 **The Lucky One:** Has never paid—constantly dodging defeat!
  - ⚡ **The Chooser / The Foodie:** Dominates wins and drives decision-making.
- **Fairness Mode:** Toggle between weighted probabilities (giving frequent losers a break) and raw equal chance.
- **Local-First & Cloud-Synced:** Works 100% offline via local storage (`AsyncStorage`) and seamlessly syncs game records to **Supabase PostgreSQL** whenever an internet connection is available.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [React Native 0.88](https://reactnative.dev/) with [Expo SDK 58](https://expo.dev/) (New Architecture ready)
- **Language:** TypeScript 5.8 (Strict typing, 0 type errors, 0 lint warnings)
- **Animations & Gestures:** [React Native Reanimated 4](https://docs.swmansion.com/react-native-reanimated/) & [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- **Graphics:** [React Native SVG](https://github.com/software-mansion/react-native-svg) (custom vector illustrations, avatars, and party doodles)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) with multi-key persistent hydration
- **Haptics:** [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) for physical sensory feedback
- **Cloud Backend:** [Supabase](https://supabase.com/) (PostgreSQL cloud ledger & RLS policies)

---

## 🚀 How Users Can Play

### 1. Multi-Touch Drop-In
2 to 8 players place and hold a finger on the phone's glass. Floating colored halos and countdown rings lock in active slots.

### 2. Group & Name Selection
Select which circle is playing (College, Office, Flatmates) or enter custom player names. By default, players are auto-assigned as `Player A`, `Player B`, etc., so setup takes under 3 seconds.

### 3. Choose the Stakes
Pick your dilemma category and consequence mode:
- 💳 **Who Pays?** (Food, drinks, coffee, takeout)
- 🍕 **Awkward Duty** (Taking out trash, talking to landlord, washing dishes)
- ⚖️ **The Ledger Vengeance** (Settling historic debts)
- 🎵 **Aux Cord Dictator** (Losing music control for the car ride)
- 📵 **Screen Time Penalty** (Phone face-down for 1 hour)

### 4. Play the Arena & Reveal Verdict
The game resolves the outcome with confetti, winner tags, and an animated loser card. Tap **Stakes ⚡** to jump straight to another round, or **Check Karma ✨** to view updated standings.

---

## 📲 How to Share the App

### Option A: Direct Android APK (No Expo Go Required)
1. Install EAS CLI and login to your Expo account:
   ```bash
   npm install -g eas-cli
   eas login
   ```
2. Run the APK build command:
   ```bash
   eas build -p android --profile preview
   ```
3. When the build completes in 5–7 minutes, EAS provides a **direct download URL and QR code**. Open the link on any Android device, tap **Download**, and install the APK! *(Enable "Install Unknown Apps" in Android Settings if prompted)*.

### Option B: Instant Web Version (Works on ANY Device Browser)
You can deploy the pre-built web version (`dist/`) to any static host for free:
- **Netlify Drop:** Drag and drop the `dist/` folder into [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel:** Run `npx vercel --prod dist`.
- **Surge:** Run `npx surge dist`.
Anyone can open the URL in Chrome, Safari, or Brave on iOS, Android, or PC and play immediately with full touch support.

### Option C: Share via Expo Go
To let friends test on their phones via Expo Go across different Wi-Fi networks or mobile data:
```bash
npx expo start --tunnel
```
Send your friend the generated QR code or exp:// URL to launch in the free Expo Go app.

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript check & Linter
npm run typecheck
npm run lint

# 3. Run game engine unit tests
node --test src/features/games/*/__tests__/*.test.ts

# 4. Start Expo local dev server
npm start
```

---

## 📄 License
MIT © 2026 Who Pays? Team
