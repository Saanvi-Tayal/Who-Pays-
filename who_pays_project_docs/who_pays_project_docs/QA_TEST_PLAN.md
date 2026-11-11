# QA & TEST PLAN — WHO PAYS?

## 1. Test strategy

Test in layers:
- Unit tests for game rules and calculations.
- Component tests for important interaction states.
- Integration tests for session flow and persistence.
- Physical-device tests for multi-touch, haptics, audio and animation.
- Visual screenshot review against supplied reference images.

A simulator alone is not enough to validate multi-touch and haptic behaviour.

## 2. Foundation tests

- App launches on a clean install.
- Navigation routes resolve.
- TypeScript check passes.
- Lint passes.
- Reanimated test animation runs.
- Gesture Handler test gesture works.
- Missing asset does not crash app.

## 3. Drop-In tests

- 1 touch: waiting state.
- 2 touches held for required duration: two players created.
- 8 touches: maximum accepted.
- 9th touch: rejected/ignored with clear feedback.
- Finger lifts before lock: state updates correctly.
- Touch cancellation: no ghost player remains.
- Repeated touch IDs do not create duplicate slots.
- Player colours remain unique.
- Test on at least one physical Android device; test iOS if supported.

## 4. Player setup tests

- Rename player.
- Leave player anonymous.
- Change avatar.
- Missing avatar placeholder.
- Exclude and re-include player.
- Attempt to continue with one active player.
- Verify colour/slot identity persists.

## 5. Mode and lobby tests

- Select each mode.
- Select each game.
- Back navigation preserves selection.
- Ledger Vengeance with no history.
- Ledger Vengeance with insufficient eligible players.
- Start game routes to correct arena.

## 6. Game tests

### Time Bomb
- Minimum and maximum fuse durations.
- Explicit holder assignment.
- Pass confirmation updates holder.
- Explosion occurs once.
- Timer cleanup on reset/unmount.
- App background/foreground behaviour.
- No confirmed holder at expiry.

### Roulette
- Segment count matches active players.
- Wheel angle wraps correctly.
- Final pointer segment matches result.
- Boundary conditions.
- Very fast and very slow swipes.
- Repeated spins.
- Haptics disabled.
- No hidden random override.

### Tap Frenzy
- Countdown timing.
- Five-second round.
- One touch counts once.
- Held touch does not auto-repeat.
- Simultaneous taps.
- Taps outside zone ignored.
- Fewest taps loses.
- Tie-break works.
- Post-round taps ignored.

### Reaction Standoff
- Ready state requires all players.
- Random wait is within range.
- Early release is detected.
- Signal timestamp uses monotonic clock.
- Reaction times calculate correctly.
- Timeout behaviour.
- Tie behaviour.
- Repeated round resets timestamps.

## 7. Verdict and persistence tests

- Correct player shown.
- Correct consequence copy for selected mode.
- Rematch retains players/mode/game.
- Rematch clears round-specific values.
- Log It saves once.
- Double tap does not duplicate save.
- Anonymous save works.
- Failed save can retry.
- App restart retains locally saved history.

## 8. Ledger tests

- Empty history.
- One match.
- Multiple matches.
- Ties/no-contest.
- False starts/timeouts.
- Bills paid distinct from games lost.
- Statistics reconcile with raw matches.
- Loading skeletons.
- Network error and retry.
- RLS cross-user access test.

## 9. UI review

For every screen:
- Capture app screenshot at target dimensions.
- Compare to supplied reference image.
- Check layout hierarchy and spacing.
- Check font size/weight.
- Check colour and contrast.
- Check image crop/aspect ratio.
- Check small-screen overflow.
- Check safe areas.
- Check pressed/disabled states.
- Check loading, empty and error states.
- Confirm no spinner/ActivityIndicator.

## 10. Release gate

Do not call the app release-ready until:
- Full flow works from Drop-In to Ledger.
- All four games pass core tests.
- Physical-device multi-touch tests pass.
- No known blocker remains.
- Cloud security tests pass if Supabase is enabled.
- Missing asset inventory is reviewed.
- Production build succeeds.
