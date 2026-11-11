# UI DEVELOPMENT PLAN — WHO PAYS?

This document defines how the app's interface is designed and implemented. It does not replace the screen reference images. Supplied reference images remain authoritative.

## 1. Visual product direction

Who Pays? should feel like a playful, premium digital toy for a group gathered around one phone.

Target qualities:
- Bold, expressive and instantly understandable.
- Tactile rather than form-heavy.
- Friendly and a little mischievous.
- High contrast and readable in indoor social settings.
- Calm enough for setup screens; dramatic during gameplay and verdicts.
- Consistent across the whole journey.

Suggested palette direction (final values should be sampled from supplied references):
- Deep plum / near-black base.
- Butter yellow.
- Peach.
- Lilac.
- Mint.
- Soft coral.
- White/cream for readable text.

Do not force these colours if the supplied references specify different values. Extract and document the actual reference palette.

## 2. Reference-image workflow

For every screen implementation, the user will provide one or more reference images.

Before coding, the agent must create a short **Reference Analysis**:
- Screen name.
- Device/frame dimensions if known.
- Background colour/texture.
- Main content hierarchy.
- Position and relative size of key elements.
- Typography style and hierarchy.
- Colour assignments.
- Image/illustration requirements.
- Interaction affordances visible in the reference.
- Details that are ambiguous.

Then implement. Do not ask the user to repeat information visible in the reference.

### Visual fidelity rules

- Match overall composition first, then typography, spacing, colour and details.
- Do not introduce a standard app header or bottom tab bar unless shown or required.
- Do not turn every element into a card.
- Do not add gradients by default.
- Do not use emojis as substitutes for art assets.
- Do not change copy without a reason.
- Preserve negative space.
- Keep interactive elements large enough for a shared-phone environment.
- Adapt to screen dimensions while preserving hierarchy and relative proportions.

After implementation, compare a screenshot of the running app with the reference. List visible differences and fix them before calling the screen complete.

## 3. Screen-by-screen UI plan

### UI-01 — Drop-In

Purpose: invite 2–8 people to touch one phone.

Required states:
- Idle / invitation.
- One finger detected (waiting for more).
- Multiple fingers detected.
- Hold progress.
- Locked player group.
- Too few players / retry.
- Too many touches / maximum reached.

UI elements:
- Full-screen canvas.
- Central instruction.
- Touch blobs at actual touch coordinates.
- Player colour feedback.
- Hold/lock feedback.

No form, login, conventional onboarding or create-game button.

### UI-02 — Player Setup and Group Selection

Purpose: make temporary player slots understandable and optionally personal.

Required states:
- Initial detected players.
- Avatar selection open.
- Name editing.
- Player included.
- Player excluded.
- Fewer than two active players.
- Avatar missing/loading.

Each player representation should retain:
- Stable session colour.
- Avatar image or placeholder.
- Temporary slot label.
- Optional display name.
- Active/inactive state.

Avatar selection must be quick. Do not force users to name everyone.

### UI-03 — Stakes / Mode Selection

Purpose: choose the consequence of the round.

Modes:
- Who Pays?
- Awkward Duty
- Ledger Vengeance
- AUX Cord Dictator
- Screen Time Penalty

Each option needs concise explanation and a distinctive visual treatment. If the reference uses a carousel, preserve the carousel. Show a real unavailable/empty-history state for Ledger Vengeance.

### UI-04 — Game Lobby

Purpose: choose one of four mini-games.

Games:
- Time Bomb
- Haptic Roulette
- Tap Frenzy
- Reaction Standoff

Show only information useful for choosing: title, short description, visual preview and selection state. Include the active group and selected stakes if the reference shows them. Do not add long instructions to the lobby.

### UI-05 — Time Bomb Arena

Purpose: create tension and make explicit passing clear.

States:
- Instructions / ready.
- Fuse active.
- Pass prompt.
- Pass confirmed.
- Warning phase.
- Explosion.
- Result.

The current assigned player must be explicit. Do not imply the app can identify the physical phone holder.

### UI-06 — Haptic Roulette Arena

States:
- Ready.
- Dragging/spinning.
- Decelerating.
- Final segment.
- Result.

Wheel geometry and pointer must make the result legible. The visual segment under the pointer is the result.

### UI-07 — Tap Frenzy Arena

States:
- Player zones.
- Countdown.
- Active tapping.
- Time expired.
- Results/tie.

Each player zone must be large and distinguishable. Do not make labels or tap counters hard to read.

### UI-08 — Reaction Standoff Arena

States:
- Ready/hold.
- Waiting.
- Signal.
- Reaction recording.
- False start.
- Results/tie.

Use a strong visual signal. Do not communicate false precision: display milliseconds only if timing implementation supports it.

### UI-09 — Verdict

Purpose: deliver the comedic payoff.

Required content:
- Outcome phrase based on selected mode.
- Losing player's assigned colour and identity.
- Relevant game result.
- Rematch.
- Log It.

Do not show a generic “You lost” if the selected mode has a specific consequence. Ensure the screen is understandable at a glance.

### UI-10 — Player Tagging / Log It

Purpose: optionally associate temporary colour slots with saved people and save the match.

Allow:
- Keep anonymous.
- Assign a new name.
- Choose an existing saved player.
- Skip tagging and save.

Never force account creation just to log a local match.

### UI-11 — Ledger

Purpose: make group history entertaining and understandable.

Possible content:
- Total rounds.
- Recent matches.
- Loss count by player.
- Bills paid (only when the mode/result supports this).
- Win/loss distribution.
- Group leaderboard.

Do not display fabricated stats. Distinguish “lost a game” from “paid a bill”; they are not the same event.

### UI-12 — Settings / About

Minimum settings:
- Haptics on/off.
- Sound on/off.
- Reduced motion.
- Privacy/data controls.
- Clear local history, with confirmation.
- App version/about.

Only implement if included in approved scope or needed for usability.

## 4. State coverage matrix

Every data-driven screen must design these states:

| State | Required treatment |
|---|---|
| Initial | Final layout with no unexpected blank space |
| Loading | Content-shaped skeleton; no spinner |
| Empty | Helpful explanation and next action |
| Error | Human-readable message and retry |
| Success | Clear confirmation |
| Disabled | Explain why action is unavailable |
| Offline | Preserve playable local flow; explain sync status |

For the Drop-In and game arenas, prefer purpose-built waiting/ready states over generic skeletons.

## 5. Skeleton specification

Skeletons should:
- Match the size and position of final content.
- Use restrained contrast.
- Use a low-cost shimmer or gentle opacity pulse.
- Respect reduced-motion settings.
- Never display for purely synchronous state changes.
- Never replace a real error or empty state.
- Avoid layout shift.

Examples:
- Avatar: circular skeleton.
- Player row: avatar circle + two text bars.
- Match row: avatar circles + title/time bars.
- Stat panel: number block + label bar.
- Chart: chart-shaped placeholder, not a generic rectangle.

## 6. Interaction and motion language

Motion should communicate state, not decorate everything.

Use:
- Spring transitions for tactile selection.
- Short scale/opacity feedback for taps.
- Carefully timed transitions between phases.
- Stronger motion for game climax and verdict.
- Subtle, optional haptics for selection and confirmation.

Avoid:
- Constant background movement that distracts.
- Long transitions that slow group play.
- Haptic feedback on every animation frame.
- Haptics during muted/disabled settings.
- Motion that blocks input.

## 7. Responsive and accessibility requirements

- Support common phone sizes and safe areas.
- Prioritise portrait orientation unless a reference explicitly requires landscape.
- Avoid clipping on smaller screens.
- Maintain readable contrast.
- Do not rely on colour alone: use labels, icons or positional cues where possible.
- Provide accessible labels for controls.
- Respect reduced motion.
- Keep touch targets comfortably large.
- Check Android navigation/status bars and iOS safe areas.

## 8. UI completion checklist

A screen is ready for approval only when:
- Reference analysis is documented.
- Layout is implemented.
- All visible controls work.
- All states are implemented or explicitly marked not applicable.
- Missing images are in the asset manifest.
- No spinner is present.
- Screenshot comparison has been done.
- Smaller-screen layout has been checked.
- The screen works with the actual app state, not hardcoded demo data.
