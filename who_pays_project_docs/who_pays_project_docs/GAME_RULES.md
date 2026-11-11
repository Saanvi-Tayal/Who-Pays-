# GAME RULES & STATE MACHINES — WHO PAYS?

This document defines game behaviour independently of screen design.

## 1. Shared rules

- A match has 2–8 active player slots.
- Every slot has a stable `playerSlotId` and assigned colour for that match.
- A saved identity/name is optional.
- A game result must be generated once.
- A tie must be represented explicitly; do not silently choose a random loser unless the tie-break rule says so.
- The selected stakes mode changes the consequence copy/action, not the underlying game scoring.
- Resetting a game must clear runtime state without deleting player/session identity.

## 2. Time Bomb

### Purpose
A pass-the-phone hot-potato game.

### Critical constraint
The app cannot know which person physically holds the phone. Use explicit passing:
- Current holder is shown by player slot/name/colour.
- On pass, next player confirms “I have it”.
- Only after confirmation does the current holder update.
- Optional pass sequence can be fixed or chosen by the group.

### State machine
`instructions → ready → fuse_active → warning → exploded → result`

Cancellation/reset:
`any active phase → cancelled`

### Rules
- Random fuse duration: 8–20 seconds by default.
- Timer starts after all players are ready.
- Current holder at zero is the loser.
- If no holder is confirmed, pause/require confirmation rather than inventing a holder.
- App backgrounding pauses or cancels the round according to an explicit product decision; document the chosen behaviour.

### Metrics
- Fuse duration.
- Number of passes.
- Holder at explosion.
- Total elapsed time.

## 3. Haptic Roulette

### Purpose
A wheel selects the outcome based on the segment under the pointer.

### State machine
`ready → spinning → decelerating → settled → result`

### Rules
- Create N equal segments for N active players unless the reference design specifies weighted segments.
- Segment colours map to player slot IDs.
- Spin gesture sets angular velocity.
- Friction/deceleration determines final angle.
- Compute segment index from final angle and pointer offset.
- Selected segment is the result.
- Do not call random selection after the wheel stops.
- If weighted odds are introduced later, show the weighting clearly and obtain user approval.

### Boundary tests
Test exact segment boundaries, angles just before/after boundaries, negative rotations and multiple full rotations.

## 4. Tap Frenzy

### Purpose
Players tap their assigned zones for a short period. Fewest valid taps loses.

### State machine
`instructions → ready → countdown → active → finished → result`

### Rules
- Countdown: 3 seconds.
- Active duration: 5 seconds.
- Each valid touch start inside a player's zone counts once.
- A held finger does not count repeatedly.
- A touch crossing between zones does not count as a new tap unless it lifts and starts again.
- Taps after finish are ignored.
- Fewest taps loses.
- Tie for fewest taps triggers a sudden-death tie-break (recommended default): only tied players continue for a short additional round. If the tie remains, report a tie and let the group decide; do not fabricate a loser.

### Metrics
- Tap count per player.
- Active duration.
- Tie-break count.

## 5. Reaction Standoff

### Purpose
Players react to a signal. Slowest valid reaction loses.

### State machine
`instructions → ready → waiting → signal → recording → result`

### Rules
- Each player holds their assigned touch zone.
- Random wait: 2–7 seconds.
- A release before signal is a false start.
- Choose an explicit false-start policy. Recommended: false-starting player loses immediately, with the result clearly labelled.
- At signal, capture a monotonic timestamp.
- Record release timestamp per player.
- Reaction time = release timestamp − signal timestamp.
- Slowest valid reaction loses.
- If a player never releases before timeout, treat as timeout/slowest result.
- If timestamps tie within the chosen precision, report tie or run a tie-break.

### Metrics
- Signal timestamp.
- Reaction time per player.
- False-start flag.
- Timeout flag.

## 6. Result contract

A completed game returns a structured result containing:
- Match/session ID.
- Game ID.
- Start and finish timestamps.
- Active player slot IDs.
- Winner slot IDs (possibly empty).
- Loser slot ID (nullable).
- Outcome: completed, tie, false_start, timeout, no_contest.
- Game-specific metrics.
- Selected stakes mode.

Keep raw game metrics so the Ledger can distinguish a game loss from a bill payment or other consequence.

## 7. Fairness and Karma

- Default games are unbiased according to their stated mechanics.
- Do not secretly alter roulette friction, segment weights or game outcomes.
- Historical statistics may power insights and optional disclosed modes.
- Any probability adjustment must be opt-in, clearly described and testable.
