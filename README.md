# 👑 Who Pays? — Party Dispute Resolution Game

> **Turn awkward bill splits, chores, and everyday dilemmas into frantic, high-stakes physical party games.**

---

## 📖 About the Project

**Who Pays?** is a fast-paced, local multiplayer dispute resolution party app built for friends, colleagues, and roommates who are tired of awkward conversations about who picks up the food bill, takes out the trash, or gets aux cord privileges. Instead of pulling out a calculator or engaging in tedious polite debates, players place their fingers directly onto a single shared smartphone screen to lock in their players, pick their stakes, and settle the score through adrenaline-fueled party minigames.

The app tracks every outcome across distinct social circles—such as your **College Gang 🎓**, **Office Friends 💼**, or **Flatmates 🏠**—so work lunches and roommate groceries never mix. Every decision feeds into a persistent **Karma Ledger**, dynamically awarding personality archetypes like **"The ATM"** (the perpetual loser) or **"The Lucky One"** (the friend who miraculously never pays). Players can toggle a mathematically weighted **Fairness Algorithm** that gently nudges probability against lucky players, or choose **Pure Chaos** for completely raw, unadulterated chance. Designed with an energetic retro-party aesthetic, rich micro-interactions, responsive haptic feedback, and fluid 60 FPS physics animations, *Who Pays?* transforms trivial everyday disputes into unforgettable social memories.

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

## 📱 How to Experience & Play the App

### 1. 🤖 Download the Android APK (Direct Install)
You can download and install the standalone Android `.apk` directly onto any Android smartphone without needing Expo Go or developer tools:
1. Download the latest **`Who-Pays.apk`** from the [GitHub Releases](https://github.com/Saanvi-Tayal/Who-Pays-/releases) page or your EAS build download link.
2. Tap the downloaded file on your Android device.
3. If Android prompts *"File might be harmful"* or *"Install unknown apps"*, tap **Settings** ➔ toggle **Allow from this source** ➔ tap **Install**.
4. Launch **Who Pays?** from your app drawer and start playing!

---

### 2. 🌐 Play in Your Web Browser (Instant Demo)
No installation required! The web build runs on **any device** (iOS Safari, Android Chrome, Mac, Windows):
- Supports full touch controls, animations, multiplayer setup, and minigames.
- Open the live web deployment or run the pre-built `dist/` bundle on any browser.

---

### 3. ⚡ Test Live via Expo Go
If you have the **Expo Go** app installed on your physical device (available free on [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) and [Apple App Store](https://apps.apple.com/app/expo-go/id982107779)):
1. Run the cloud tunnel on the host:
   ```bash
   npx expo start --tunnel
   ```
2. Scan the terminal QR code using your phone's camera (iOS) or the Expo Go app (Android).
3. The project loads live across any Wi-Fi or cellular network regardless of geographic location.

---

### 4. 💻 Run from Source (For Evaluators & Developers)

```bash
# 1. Clone the repository
git clone https://github.com/Saanvi-Tayal/Who-Pays-.git
cd Who-Pays-

# 2. Install dependencies
npm install

# 3. Start the app (Recommended: LAN mode with fresh cache)
npx expo start --host lan --clear
```

> [!TIP]
> **Always use `npx expo start --host lan --clear`** instead of default `expo start`. This automatically broadcasts the Metro server across your local Wi-Fi network and clears stale bundler caches, ensuring physical phones can scan the QR code and connect reliably.
>
> In the terminal menu:
> - Press **`a`** to open on a connected Android phone or emulator.
> - Press **`w`** to open instantly in your web browser.
> - Scan the on-screen QR code with **Expo Go** on your phone.

#### 🧪 Running Automated Tests (Optional)
```bash
# Run all game engine unit tests
npm test

# Run strict TypeScript check and ESLint
npm run typecheck
npm run lint
```

---

## 🎯 Gameplay Walkthrough (How It Works)

1. **Multi-Touch Drop-In:** 2 to 8 players place and hold a finger on the phone's glass. Floating colored halos and countdown rings lock in active slots.
2. **Group & Name Selection:** Select which circle is playing (College Gang, Office Friends, Flatmates) or enter custom player names. By default, players are auto-assigned as `Player A`, `Player B`... so games start in under 3 seconds.
3. **Choose the Stakes:** Pick your dilemma category and consequence mode:
   - 💳 **Who Pays?** (Food, drinks, coffee, takeout)
   - 🍕 **Awkward Duty** (Taking out trash, talking to landlord, washing dishes)
   - ⚖️ **The Ledger Vengeance** (Settling historic debts)
   - 🎵 **Aux Cord Dictator** (Losing music control for the car ride)
   - 📵 **Screen Time Penalty** (Phone face-down for 1 hour)
4. **Play the Arena & Reveal Verdict:** The game resolves the outcome with winner tags, floating crowns, and an animated loser card. Tap **Stakes ⚡** to jump straight to another round, or **Check Karma ✨** to view updated standings.

---

## 📄 License
MIT © 2026 Who Pays? Team
