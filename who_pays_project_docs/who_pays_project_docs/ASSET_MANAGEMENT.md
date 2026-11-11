# ASSET MANAGEMENT — WHO PAYS?

## 1. Purpose

This file is the source of truth for every non-code visual asset. Update it whenever an image, texture, sound or illustration is needed.

Do not assume an asset exists because a filename appears in code.

## 2. Asset workflow

For each required asset:
1. Identify it from the screen reference.
2. Create the correct image slot/placeholder.
3. Add a row to the inventory below.
4. Tell the user the exact filename, path, dimensions, format, aspect ratio, transparency and visual brief.
5. Keep the screen functional without the asset.
6. Integrate the supplied file and verify it renders correctly.
7. Mark its status as `Integrated`.

Never silently substitute emoji, clip art or a random online image.

## 3. Naming convention

- Lowercase snake_case.
- Descriptive names.
- No spaces.
- Use `.png` for transparency; `.webp` may be used for photographic/illustrative assets if the Expo pipeline is verified.
- Keep asset paths stable after integration.

## 4. Initial candidate inventory

These are candidate assets. Only create entries that the approved reference designs actually need.

| Asset ID | Suggested path | Suggested size | Format | Notes |
|---|---|---:|---|---|
| AV-01 to AV-12 | `src/components/illustrations/AvatarsSvg.tsx` | Vector SVG | SVG / TSX | Integrated: 12 anime character portraits matching reference art (Gravit, Saanvi, Aman, Priya, etc.) |
| MODE-01 | `src/components/illustrations/GameArtSvg.tsx` | Vector SVG | SVG / TSX | Integrated: Golden money bag with $ sign (MoneyBagSvg) matching reference Screen 2 |
| MODE-02 | `src/components/illustrations/GameArtSvg.tsx` | Vector SVG | SVG / TSX | Integrated: Cloche waiter tray with awkward sweat (AwkwardDutySvg) |
| MODE-03 | `src/components/illustrations/GameArtSvg.tsx` | Vector SVG | SVG / TSX | Integrated: Glowing scales of justice (ScalesJusticeSvg) |
| MODE-04 | `src/components/illustrations/GameArtSvg.tsx` | Vector SVG | SVG / TSX | Integrated: DJ headphones with audio waveform (AuxHeadphonesSvg) |
| MODE-05 | `src/components/illustrations/GameArtSvg.tsx` | Vector SVG | SVG / TSX | Integrated: Phone face-down with do-not-touch slash (ScreenTimeSvg) |
| GAME-01 | `src/components/illustrations/GameArtSvg.tsx` | Vector SVG | SVG / TSX | Integrated: Glossy purple bomb with burning fuse (BombSvg) matching reference Screen 3 & 4 |
| GAME-02 | `src/components/illustrations/GameArtSvg.tsx` | Vector SVG | SVG / TSX | Integrated: 8-segment prize roulette wheel with pointer (RouletteWheelSvg) matching reference Screen 3 |
| GAME-03 | `src/components/illustrations/GameArtSvg.tsx` | Vector SVG | SVG / TSX | Integrated: Electric yellow lightning bolt (LightningSvg) matching reference Screen 3 |
| GAME-04 | `src/components/illustrations/GameArtSvg.tsx` | Vector SVG | SVG / TSX | Integrated: Hand pointing with target radar rings (ReactionHandSvg) matching reference Screen 3 |
| FX-01 | `assets/games/time_bomb/explosion_particles.png` | 1024×1024 | PNG | Transparent particle texture if needed |
| FX-02 | `assets/games/roulette/needle.png` | 256×512 | PNG | Transparent pointer if needed |
| FX-03 | `assets/games/roulette/wheel_center.png` | 512×512 | PNG | Centre detail if needed |

Do not create all candidate assets blindly. Reference images determine the actual asset requirements.

## 5. Anime avatar art direction

If the player setup reference needs anime avatars, create a coherent set:
- 12 distinct character portraits.
- Different hairstyles, hair colours, accessories, clothing and expressions.
- Consistent crop, camera angle, line quality and lighting.
- Face clearly visible.
- Vibrant but controlled palette.
- No text, logos or watermarks.
- Avoid stereotypes and avoid making avatars imply real player identity.

Recommended: 512×512 px square PNG. Transparent background only if the design requires it; otherwise use a consistent solid/background treatment sampled from the reference.

## 6. Placeholder behaviour

A missing asset must:
- Render a deliberate placeholder with the correct dimensions.
- Preserve the intended layout.
- Be visible in development so the missing file is noticed.
- Avoid crashing the app.
- Not be mistaken for a final design.

In production, missing required assets should be caught by an asset validation script or build-time check.

## 7. Asset inventory template

Add one row per asset:

| ID | Screen | Filename | Dimensions | Aspect | Format | Transparency | Visual brief | Status |
|---|---|---|---:|---|---|---|---|---|
| MODE-01 | Stakes | `who_pays.png` | 768×768 | 1:1 | PNG | Yes | Golden money bag with dollar sign, glowing neon outline | Placeholder |
| GAME-01 | Lobby | `time_bomb.png` | 768×768 | 1:1 | PNG | Yes | Glossy purple round bomb with burning sparked wick | Placeholder |
| GAME-02 | Lobby | `haptic_roulette.png` | 768×768 | 1:1 | PNG | Yes | Spinning multi-colored prize wheel with segmented sectors | Placeholder |
| GAME-03 | Lobby | `tap_frenzy.png` | 768×768 | 1:1 | PNG | Yes | Electric yellow lightning bolt with neon glow | Placeholder |
| GAME-04 | Lobby | `reaction_standoff.png` | 768×768 | 1:1 | PNG | Yes | Hand pointing finger with neon shockwaves | Placeholder |

## 8. User handoff format

When asking the user for assets, provide a compact checklist:

- **Filename:** `avatar_01.png`
- **Save to:** `assets/avatars/avatar_01.png`
- **Size:** 512 × 512 px
- **Format:** PNG
- **Aspect:** 1:1
- **Transparency:** No
- **Visual brief:** anime portrait, short teal hair, cheerful expression, chest-up crop, consistent series style.

Do not ask the user to provide an image without specifying where it goes and what it should look like.
