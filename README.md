# 🎲 Who Pays?

### Don't argue over who pays. Let the game decide.

**Who Pays?** is a local multiplayer party game that turns everyday group dilemmas into competitive mini-games. From deciding who pays the restaurant bill to choosing who takes out the trash or controls the aux, it makes awkward decisions entertaining.

Built for friends, college groups, office colleagues, and flatmates, the app brings everyone together around a single smartphone. No accounts, no invitations, no complicated setup. Just touch, play, and find out who's paying.

---

## ✨ Features

- **Instant Multiplayer:** 2–8 players can join using multi-touch interaction on a single device.
- **Multiple Game Arenas:** Four fast-paced mini-games combining luck, reflexes, and reaction time.
- **Social Circles:** Maintain separate groups for College Gang 🎓, Office Friends 💼, Flatmates 🏠, or create custom circles.
- **Karma Ledger:** Track game history, player statistics, loss records, and group leaderboards.
- **Fairness Mode:** A weighted probability system that considers previous outcomes to give frequent losers a better chance.
- **Pure Chaos Mode:** Switch to equal-probability random outcomes for completely unpredictable games.
- **Player Archetypes:** Discover group personalities like *The ATM* (frequent payer) and *The Lucky One* (never seems to lose).
- **Immersive Feedback:** Animated interactions, haptic responses, and MP3 sound effects make every round feel like a party game.
- **Offline-First Experience:** Game data is stored locally and can sync with Supabase when an internet connection is available.

---

## 🎮 Game Modes

| Game | How It Works |
|---|---|
| 💣 **Time Bomb** | Pass the phone before the hidden timer expires. Whoever holds the bomb when it detonates loses. |
| 🎡 **Russian Roulette** | Spin the roulette wheel and let its physics-driven animation reveal the unlucky player. |
| ⚡ **Tap Frenzy** | Tap your assigned screen zone as fast as possible within five seconds. The fewest taps loses. |
| 🎯 **Reaction Standoff** | Hold your assigned area and release when the signal appears. The slowest reaction loses. False starts are penalised. |

Every game ends with an animated verdict screen revealing the player who has to take responsibility.

---

## 👥 Social Circles & Karma Ledger

Different friend groups have different dynamics. Who Pays? keeps them separate.

Examples:
- 🎓 **College Gang:** Track food bills, canteen expenses, and campus dares.
- 💼 **Office Friends:** Settle lunch bills, coffee runs, and workplace challenges.
- 🏠 **Flatmates:** Decide who handles groceries, dishes, and household chores.

Each circle maintains its own player list, game history, statistics, and leaderboard.

### The Fairness System

Players can choose between two modes:

- **Fairness Mode:** Uses weighted probabilities based on previous outcomes to reduce repeated losses.
- **Pure Chaos:** Uses equal random selection probabilities, giving everyone the same chance.

The Karma Ledger also tracks player tendencies and assigns fun personality archetypes based on group performance.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native 0.88 | Cross-platform mobile application |
| Expo SDK 58 | Development and deployment |
| TypeScript 5.8 | Application logic and type safety |
| React Native Reanimated 4 | Smooth animations and transitions |
| React Native Gesture Handler | Multi-touch gestures and interactions |
| React Native SVG | Custom vector graphics and illustrations |
| Zustand | State management |
| AsyncStorage | Local persistence |
| Expo Haptics | Tactile feedback |
| Supabase PostgreSQL | Cloud database and game history |

---

## 🚀 Getting Started

### Option 1: Install the Android APK

The easiest way to experience the app is to install the Android build directly.

<**[Download Who Pays? for Android](https://expo.dev/accounts/sin_v/projects/who-pays/builds/0fb355c0-569c-4a86-a4fb-d44b0ff55e89)**>

1. Open the download link on your Android device.
2. Download the APK.
3. Allow installation from the browser or source if Android asks.
4. Install and launch **Who Pays?**

### Option 2: Run Locally

**Prerequisites**
- Node.js and npm
- Git
- Expo Go (for testing on a physical device)

**1. Clone the repository**

```bash
git clone https://github.com/Saanvi-Tayal/Who-Pays-.git
cd Who-Pays-
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npx expo start --host lan --clear
```

**4. Launch the application**

- Press `a` to open on an Android emulator.
- Press `w` to launch the web version, if supported by the current build.
- Scan the QR code using Expo Go to test on a physical device.

**Tip:** Keep your phone and development machine connected to the same Wi-Fi network when using LAN mode.

### Option 3: Run Tests

```bash
# Run game engine tests
npm test

# TypeScript checks
npm run typecheck

# ESLint
npm run lint
```

---

## 🎯 How to Play

1. **Drop In:** Everyone places a finger on the shared screen. The app detects players and assigns each a unique colour.
2. **Choose Your Circle:** Select a saved group or create a custom group with your friends.
3. **Set the Stakes:** Decide what the loser has to do — pay the bill, take out the trash, surrender the aux, or something else.
4. **Choose Your Arena:** Pick a mini-game and let the competition begin.
5. **Reveal the Verdict:** Watch the animated result screen reveal the loser.
6. **Check Your Karma:** Record the result, update group statistics, and challenge everyone to a rematch.

