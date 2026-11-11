# TECHNICAL ARCHITECTURE — WHO PAYS?

## 1. Recommended stack

Use Expo + React Native + TypeScript, with Expo-compatible dependency versions.

Recommended building blocks:
- Expo SDK selected at project creation.
- TypeScript strict mode.
- React Navigation (native stack) or Expo Router. Choose one; do not mix routing systems.
- React Native Gesture Handler for touch/gesture handling.
- React Native Reanimated for UI-thread animations.
- Expo Haptics for supported haptic feedback.
- Expo Audio (or the audio package supported by the selected Expo SDK) for sound effects.
- Local persistence through a small storage abstraction (e.g. AsyncStorage or SQLite, selected based on requirements).
- Supabase JS client for cloud persistence in the later backend milestone.
- A lightweight validation library only if needed at data boundaries.

Use `npx expo install` for Expo-managed native dependencies to obtain SDK-compatible versions. Do not blindly install latest versions from npm.

## 2. Architectural layers

```text
Presentation
  Screens
  Components
  Theme
  Animation primitives
       ↓
Application
  Use cases / controllers
  Session orchestration
  Match lifecycle
       ↓
Domain
  Player
  Group
  Mode
  Game
  Match
  Game rules / scoring
       ↓
Infrastructure
  Local repositories
  Supabase repositories
  Audio / haptics adapters
  Asset resolver
```

Rules:
- Domain rules must not import React Native components.
- Screens must not contain SQL or direct Supabase queries.
- Game outcome calculations must be testable as pure functions where possible.
- Persistence implementation must be replaceable without rewriting screens.
- Animation state must not become the source of truth for game results.

## 3. Suggested folder structure

```text
who-pays/
├── app.json
├── package.json
├── tsconfig.json
├── babel.config.js
├── README.md
├── docs/
│   └── [this documentation pack]
├── assets/
│   ├── avatars/
│   ├── modes/
│   ├── games/
│   │   ├── time-bomb/
│   │   ├── roulette/
│   │   ├── tap-frenzy/
│   │   └── reaction-standoff/
│   ├── sounds/
│   └── textures/
├── src/
│   ├── app/
│   │   ├── navigation/
│   │   ├── providers/
│   │   └── AppRoot.tsx
│   ├── screens/
│   │   ├── drop-in/
│   │   ├── player-setup/
│   │   ├── stakes/
│   │   ├── game-lobby/
│   │   ├── arenas/
│   │   │   ├── time-bomb/
│   │   │   ├── roulette/
│   │   │   ├── tap-frenzy/
│   │   │   └── reaction-standoff/
│   │   ├── verdict/
│   │   ├── player-tagging/
│   │   ├── ledger/
│   │   └── settings/
│   ├── components/
│   │   ├── buttons/
│   │   ├── avatars/
│   │   ├── skeletons/
│   │   ├── typography/
│   │   ├── layout/
│   │   └── feedback/
│   ├── domain/
│   │   ├── models/
│   │   ├── rules/
│   │   ├── scoring/
│   │   └── state-machines/
│   ├── features/
│   │   ├── session/
│   │   ├── players/
│   │   ├── matches/
│   │   ├── ledger/
│   │   └── settings/
│   ├── infrastructure/
│   │   ├── storage/
│   │   ├── supabase/
│   │   ├── audio/
│   │   ├── haptics/
│   │   └── assets/
│   ├── hooks/
│   ├── theme/
│   ├── types/
│   └── utils/
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── tests/
    ├── unit/
    └── integration/
```

This is a target structure, not a reason to create dozens of empty files. Create directories when their first implementation is needed.

## 4. Navigation

Use a typed route map. Suggested route names:
- `DropIn`
- `PlayerSetup`
- `Stakes`
- `GameLobby`
- `TimeBombArena`
- `RouletteArena`
- `TapFrenzyArena`
- `ReactionStandoffArena`
- `Verdict`
- `PlayerTagging`
- `Ledger`
- `Settings`

The game lobby routes to the correct arena based on selected game. The arena returns a typed `MatchResult` to the match lifecycle controller, which navigates to Verdict.

Do not pass large mutable objects through route params. Keep session state in the session store; route params should contain identifiers or minimal immutable data.

## 5. State ownership

Keep separate:
- **Session state:** current player slots, active participants, selected mode/game.
- **Game runtime state:** current phase, timer, touches, wheel angle, tap counts, reaction timestamps.
- **Persistent data:** saved identities, groups and match history.
- **UI-only state:** modal visibility, current carousel index, editing state.

A lightweight state store (e.g. Zustand) is suitable if state complexity warrants it. React Context plus reducers is also acceptable for the first release. The agent must choose one approach and explain why before adding dependencies.

Never put high-frequency animation values (wheel angle, blob position, particle coordinates) into a global React state store.

## 6. Game state machine contract

Each game should expose a consistent interface conceptually similar to:

```ts
type GameStatus =
  | 'instructions'
  | 'ready'
  | 'countdown'
  | 'playing'
  | 'finished'
  | 'cancelled';

type GameResult = {
  gameId: GameId;
  loserPlayerSlotId: string | null;
  winnerPlayerSlotIds: string[];
  outcome: 'completed' | 'tie' | 'no-contest';
  startedAt: number;
  finishedAt: number;
  metrics: Record<string, number | string | boolean>;
};
```

The exact types can be refined, but game result calculation must be separate from rendering.

## 7. Multi-touch adapter

Implement a small touch adapter responsible for:
- Normalising touch IDs and coordinates.
- Tracking active touches.
- Mapping touch zones to player slots where applicable.
- Handling touch start/move/end/cancel.
- Enforcing supported player/touch limits.
- Cleaning up on screen exit.

Do not let every screen invent its own touch tracking logic.

Important distinction:
- Drop-In: touch positions identify temporary slots.
- Tap Frenzy: touch coordinates map to fixed player zones.
- Reaction Standoff: a player is assigned a zone and release time.
- Time Bomb: the current holder is explicitly selected/confirmed by the user; physical holder detection is not available.
- Roulette: a single gesture controls the wheel.

Test native multi-touch on physical devices.

## 8. Animation and haptics

- Reanimated owns visual interpolation and high-frequency motion.
- React state owns meaningful discrete game phases and result data.
- Haptics adapter exposes semantic functions, e.g. `selection()`, `lightImpact()`, `heavyImpact()`, `success()`.
- Respect haptics setting and platform capability.
- Avoid triggering haptics from every animation frame.
- Audio adapter handles loading, playback, mute and cleanup.
- Sound assets must be local and properly licensed/original.

## 9. Persistence strategy

First:
- Make the core game playable without network.
- Save optional local match history.
- Use repository interfaces.

Later:
- Add Supabase repository implementation.
- Sync only data the user has chosen to save.
- Provide pending/synced/error status if offline sync is supported.

Do not make game start dependent on Supabase availability.

## 10. Performance principles

- Avoid rerendering the entire screen for every tap.
- Keep animation values on UI thread.
- Use stable keys for player lists.
- Preload only small assets needed for the next screen.
- Dispose timers and audio resources.
- Test on a mid-range Android device.
- Measure before adding complexity or optimising prematurely.
