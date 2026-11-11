# DESIGN SYSTEM — WHO PAYS?

## 1. Design-system rule

The supplied UI reference images override all suggested values in this file. This document establishes consistency where references do not specify a detail.

Before implementing the first screen, sample colours and typography from the references and replace provisional tokens with actual values.

## 2. Provisional colour tokens

Use semantic tokens rather than scattering hex values through components.

```ts
export const colors = {
  background: '#1D1426',
  surface: '#2A2034',
  textPrimary: '#FFF9F0',
  textSecondary: '#C9BECE',
  plum: '#3A2448',
  butter: '#F7D96B',
  peach: '#FFB99E',
  lilac: '#B9A4F4',
  mint: '#9BDCC2',
  coral: '#FF7F7F',
  danger: '#E94B5B',
  success: '#6BCB9A',
};
```

These are provisional design directions only. Do not use them if they conflict with the supplied reference.

## 3. Player colour system

Use a fixed palette of at least eight distinguishable colours. Assign colours in a stable order for the session. Avoid adjacent colours that are difficult to distinguish.

Every player colour must have:
- Main colour.
- Accessible text/contrast colour.
- Optional darker/lighter shade for states.
- Non-colour identity cue (slot label/avatar/position).

Do not change a player's colour between setup, game, verdict and ledger for the same match.

## 4. Typography

Create semantic text styles:
- Display / verdict.
- Screen title.
- Section title.
- Player name.
- Body.
- Supporting label.
- Numeric statistic.
- Button label.

Use bundled/local fonts only if licensing and Expo integration are verified. Otherwise use a system font with controlled weight and letter spacing.

Typography should be bold and expressive, but not sacrifice readability.

## 5. Spacing and shape

Create a spacing scale (for example 4, 8, 12, 16, 24, 32, 48) and radius scale. Use tokens consistently.

Do not add a card radius, shadow or border to every component. Match the visual language of the reference.

## 6. Core component behaviour

### ScreenContainer
- Handles safe area and background.
- Supports edge-to-edge game screens where appropriate.
- Does not impose a header automatically.

### PrimaryButton
- Has pressed, disabled and loading states.
- Loading state uses inline skeleton/label treatment only when needed; never a spinner.
- Has accessible label and adequate touch target.

### AvatarImage
- Uses a local asset key.
- Shows a designed placeholder if asset is missing.
- Preserves crop and aspect ratio.
- Does not silently use a random fallback avatar.

### Skeleton
- Supports shape, dimensions and optional shimmer.
- Respects reduced motion.
- Is used only for actual asynchronous loading.

### AnimatedPressable
- Provides consistent pressed feedback.
- Does not make controls feel sluggish.
- Supports accessibility and disabled state.

## 7. Motion tokens

Use short, consistent durations:
- Micro feedback: approximately 100–160 ms.
- Standard transition: approximately 180–280 ms.
- Dramatic game transition: approximately 300–600 ms.

These are starting points. Tune to the reference and device performance.

Use springs for tactile movement, timing for deliberate transitions. Avoid animations that block user input.

## 8. Haptic tokens

Map semantic actions to platform haptics:
- `selection`: carousel/option change.
- `light`: small acknowledgement.
- `medium`: confirm/lock.
- `heavy`: major reveal/climax.
- `success`: successful save or completion.

Do not assume every device supports identical haptic styles. Provide a no-haptics fallback.

## 9. Sound

- Sound is optional and user-controllable.
- Use original or licensed sound assets.
- Provide mute control.
- Avoid surprise loud audio at app launch.
- Handle audio focus/interruption and cleanup.

## 10. Skeleton rules

Never use spinner loaders or `ActivityIndicator`.

Skeletons should reflect final layout:
- Avatar: circle.
- Player item: avatar + text bars.
- Stat tile: number + label.
- Chart: chart-like placeholder.
- History list: repeated row structure.

Do not show skeletons for instant local state changes. Use a purposeful transition instead.

## 11. Accessibility and reduced motion

- Never rely on colour alone to identify a player.
- Support system font scaling where layout allows.
- Label icon-only controls.
- Respect reduced motion.
- Keep contrast readable.
- Avoid flashing patterns that could create discomfort.
- Do not use rapid full-screen flashing as the only signal; provide an accessible alternative.
