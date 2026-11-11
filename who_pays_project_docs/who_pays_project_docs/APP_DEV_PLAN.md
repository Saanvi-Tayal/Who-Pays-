# APP DEVELOPMENT PLAN — WHO PAYS?

## 1. Product definition

**Who Pays?** is a single-device, pass-the-phone party game that turns small group decisions into short, tactile mini-games. A group joins by touching one phone, selects players and stakes, plays a mini-game, sees a dramatic verdict, and optionally logs the result in a group Ledger.

The product should feel like a playful digital object: immediate, expressive, responsive and easy to understand in a noisy social setting.

### Product principles

1. **Zero-friction entry:** no mandatory login, no account creation before the first game.
2. **Social clarity:** the group should understand what to do without reading long instructions.
3. **Physical-feeling interaction:** gestures, animation and carefully timed haptics should make actions satisfying.
4. **Honest outcomes:** game rules and randomness must be transparent.
5. **Optional persistence:** a group can play without creating names or saving history.
6. **Visual consistency:** screens share one design system and follow supplied reference images.

## 2. First-release scope

### In scope

- Expo + React Native + TypeScript application.
- Drop-In multi-touch player registration.
- Player colour assignment.
- Player setup, avatar selection and optional naming.
- Include/exclude players from a match.
- Stakes/mode selection.
- Mini-game selection.
- Four playable mini-games:
  - Time Bomb
  - Haptic Roulette
  - Tap Frenzy
  - Reaction Standoff
- Verdict screen.
- Rematch.
- Optional match logging.
- Local persistence for basic continuity.
- Supabase-backed group/player/match history as a separate milestone.
- Ledger screen with history and simple statistics.
- Skeleton loading, empty states and error states.
- Sound/haptic settings and reduced-motion consideration.

### Not in first release unless explicitly approved

- Accounts with email/password.
- Real-time online multiplayer across separate phones.
- Cloud synchronisation between devices.
- AI-generated tasks or moderation.
- Hidden manipulation of game probabilities.
- Face recognition or automatic human identification.
- Complex social graph/friend discovery.
- Payments, bill splitting or actual financial transactions.

## 3. User journey

```text
App opens
  ↓
Drop-In: everyone touches and holds
  ↓
Player Setup: assign/choose avatar and optional name
  ↓
Group Selection: include players for this round
  ↓
Stakes: choose what the outcome means
  ↓
Game Lobby: choose one mini-game
  ↓
Arena: play the selected mini-game
  ↓
Verdict: show the outcome
  ├── Rematch → same players, mode and game; reset round state
  └── Log It → tag players if desired → save match
                         ↓
                       Ledger
```

A user must be able to go back safely before a game starts. Once a round is in progress, avoid accidental navigation that discards the match.

## 4. Core domain concepts

- **Session:** temporary in-memory/local context for the current play experience.
- **Player slot:** one participant registered by a touch, represented by a stable colour and optional avatar/name.
- **Group:** a saved collection of player identities. Optional for anonymous play.
- **Match:** one completed mini-game round with a mode, game, participants and outcome.
- **Participant result:** a player's participation and result within a match.
- **Ledger:** a view over saved matches and aggregated player statistics.

Do not conflate a player slot (e.g. BLUE) with a saved person. The slot is temporary; a saved identity may be associated with it after the round.

## 5. Development milestones

Build in this order. Each milestone has a stop point and must be approved before continuing.

### M0 — Repository inspection and implementation proposal

**Goal:** establish a reliable baseline.

Tasks:
- Inspect repository and available tooling.
- Confirm Node/package manager versions and Expo SDK compatibility.
- Propose folder structure and dependency list.
- Identify platform targets (Android first unless user says otherwise; keep iOS viable).
- Explain navigation, state management, animation and gesture strategy.
- Explain asset workflow and testing.
- Do not implement product screens.

Acceptance:
- Written proposal covers architecture and trade-offs.
- No unapproved destructive changes.
- User approves setup.

### M1 — Project foundation

Tasks:
- Create Expo TypeScript app.
- Configure strict TypeScript, linting and formatting.
- Install navigation, Gesture Handler, Reanimated, haptics and audio dependencies compatible with the selected Expo SDK.
- Configure safe area and app entry point.
- Add theme tokens and basic shared primitives.
- Add a placeholder asset resolver that handles missing assets safely.
- Add a minimal development home/test route only.

Acceptance:
- App starts on target device/emulator.
- TypeScript check passes.
- Lint passes.
- Gesture Handler and Reanimated work in a test interaction.
- No product screen is prematurely built.

### M2 — Navigation and app state foundation

Tasks:
- Define route types.
- Define typed session/player/match state.
- Implement navigation between planned routes using temporary development placeholders.
- Implement state persistence boundaries (in-memory first; local storage only where justified).
- Define reset/back behaviour.

Acceptance:
- Can navigate through the route skeleton.
- State survives route changes.
- Reset starts a clean session.
- No screen-specific business logic is hidden in navigation code.

### M3 — Drop-In touch registration

Tasks:
- Build the reference-matched Drop-In screen.
- Detect 2–8 simultaneous touch points.
- Assign deterministic distinct player colours for the session.
- Hold-to-lock interaction (2.5 seconds, configurable).
- Handle cancellation, too few players and maximum players.
- Haptic feedback and animated touch blobs.

Acceptance:
- Two or more fingers can register simultaneously on supported hardware.
- No duplicate player slots from one finger.
- Lifting before the hold completes cancels or updates according to the defined UX.
- 1 player cannot continue; more than 8 cannot register.
- The screen works on a physical device, not only a simulator.
- Transition carries all registered player slots forward.

Technical caveat: test the actual gesture library behaviour on physical Android/iOS devices. Do not assume a web-style pointer API maps identically to native touch handling.

### M4 — Player setup and group selection

Tasks:
- Show detected player slots.
- Select avatar from local asset collection.
- Set optional display names.
- Include/exclude players.
- Enforce 2–8 active players.
- Preserve player colour and identity through the session.

Acceptance:
- Missing avatars show labelled placeholders, never broken-image icons.
- Names can be empty.
- Selection is reflected in session state.
- Cannot proceed with fewer than two active players.
- Back navigation does not lose edits.

### M5 — Stakes/mode selection

Tasks:
- Implement five modes:
  - Who Pays?
  - Awkward Duty
  - Ledger Vengeance
  - AUX Cord Dictator
  - Screen Time Penalty
- Explain each mode in concise copy.
- Persist selected mode.
- Handle Ledger Vengeance when no history exists.

Acceptance:
- Mode selection works by tap/swipe as shown in reference.
- Selected mode is visually obvious.
- Empty historical data does not fabricate eligible players.
- The app provides a sensible fallback/disabled explanation for Ledger Vengeance.

### M6 — Game lobby

Tasks:
- Show four games and concise descriptions.
- Show active players and selected stakes.
- Select a game.
- Start selected game.
- Validate game/player compatibility.

Acceptance:
- All four games navigate to the correct arena.
- Player/mode/game state remains intact.
- Start action is disabled until a game is selected if selection is mandatory.
- No game logic is implemented in the lobby.

### M7 — Arena: Time Bomb

Tasks:
- Define game state machine.
- Implement random fuse duration (configurable range, default 8–20 seconds).
- Implement explicit pass/confirm interaction between players.
- Track which player is assigned the bomb through explicit hand-off state.
- Explosion and result calculation.
- Haptic/audio feedback with user settings respected.

Acceptance:
- A player cannot be inferred from device ownership; the interface explicitly records the pass.
- Exactly one result is produced.
- Timer is cancelled on unmount/reset.
- Pause/background behaviour is defined and tested.

### M8 — Arena: Haptic Roulette

Tasks:
- Build segmented wheel from active player colours.
- Implement swipe velocity, friction and deceleration.
- Calculate selected segment from final rotation angle.
- Synchronise tick haptics with segment boundary crossings.
- Handle reduced haptics and unsupported devices.

Acceptance:
- Final result always matches the visual pointer/segment.
- No separately randomised outcome.
- Wheel can be spun repeatedly after reset.
- Haptics do not fire excessively or block UI.
- Test angle calculations for segment boundaries and wraparound.

### M9 — Arena: Tap Frenzy

Tasks:
- Divide screen into player zones.
- Countdown 3–2–1–GO.
- Five-second tap window.
- Per-player tap counting and feedback.
- Fewest valid taps loses.
- Tie handling.

Acceptance:
- One touch increments only one player's zone.
- Simultaneous touches are counted correctly on supported hardware.
- Taps outside zones do not count.
- Ties have a deterministic, explained resolution (recommended: sudden-death tie-break round).
- Result is generated once.

### M10 — Arena: Reaction Standoff

Tasks:
- Ready/hold state for all players.
- Random wait interval 2–7 seconds.
- Signal event.
- Record release times using a monotonic clock.
- Detect early releases/false starts.
- Determine slowest valid reaction.
- Tie handling.

Acceptance:
- Early release is not treated as a fast reaction.
- Timing uses a monotonic time source, not render frames.
- The result is calculated from recorded timestamps.
- State resets correctly for rematch.
- Multi-touch behaviour is tested on device.

### M11 — Verdict and rematch

Tasks:
- Display loser/winner according to game rule.
- Show player identity, colour and relevant stats.
- Rematch with same selected players/mode/game.
- Log It path.
- Prevent duplicate result writes.

Acceptance:
- Correct outcome is displayed for all games.
- Rematch resets round-specific state only.
- Rematch does not duplicate a saved match.
- Log It opens tagging/logging flow.

### M12 — Local persistence and player tagging

Tasks:
- Allow anonymous match logging.
- Allow optional name assignment after the round.
- Allow saved friend/player identity association.
- Store local history for offline use.
- Define conflict behaviour for duplicate names.

Acceptance:
- User can log without naming every player.
- App remains usable offline.
- Local data can be read after app restart.
- A failed save is recoverable and does not lose the result.

### M13 — Supabase and Ledger

Tasks:
- Create database schema and migrations.
- Configure anonymous/authenticated access model.
- Implement repository layer.
- Add Row Level Security.
- Sync saved groups, players and matches.
- Build Ledger statistics and history.

Acceptance:
- No service-role key in app.
- RLS prevents cross-group data access.
- Failed network requests show retry/error UI.
- Skeletons appear only while content is loading.
- Empty data shows honest empty states.
- Aggregates reconcile with raw match records.

### M14 — Product polish and release readiness

Tasks:
- Compare every screen against its reference image.
- Check Android and iOS layout differences.
- Verify accessibility and reduced motion.
- Check haptic/audio settings.
- Check performance, timers, cleanup and memory.
- Remove debug-only UI.
- Test fresh install and upgrade/migration paths.
- Produce release checklist.

Acceptance:
- Full end-to-end flow passes.
- No known blocker.
- No spinner/ActivityIndicator remains.
- All missing assets are listed.
- Build succeeds on intended platforms.
- Known limitations are documented honestly.

## 6. Definition of Done for every milestone

A milestone is complete only when:
- Its acceptance criteria are met.
- Relevant automated checks have been run.
- The agent has manually tested the affected flow where possible.
- No unrelated existing feature has regressed.
- Missing assets are documented.
- The implementation log is updated.
- The agent reports exact files changed and commands run.
- The user has reviewed the result.

## 7. Risk register

| Risk | Mitigation |
|---|---|
| Multi-touch behaves differently across devices | Test on physical devices early; isolate touch adapter |
| App cannot know who holds the phone | Use explicit pass/ready actions |
| Haptic APIs differ by platform | Capability check and graceful fallback |
| Audio permission/focus issues | User-controlled sound setting; test mute/background |
| Reanimated/native dependency mismatch | Use Expo-compatible versions and `npx expo install` |
| Supabase identity/RLS mistakes | Design access model before enabling cloud writes |
| Missing art blocks screens | Placeholders and asset manifest |
| Game state leaks between rounds | Explicit state machines and reset tests |
| Visual drift across screens | Shared design tokens and reference screenshot review |
