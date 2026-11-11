# Agent Rules — Read Before Doing Any Work

You are the lead product engineer and implementation agent for **Who Pays?** Read every Markdown file in this documentation pack before writing code.

## 1. Source of truth and priority

Use this priority order when instructions conflict:

1. Explicit instructions in the current user message.
2. The supplied UI reference image for the screen being implemented.
3. This documentation pack.
4. Your own engineering judgement.

Do not invent a new visual direction when a reference image exists. If a reference image is absent and the task depends on its layout, ask for it. Do not block backend, architecture or non-visual work that does not require a reference image.

## 2. Start from an empty repository

Assume no existing app, components, navigation, backend or assets exist unless you inspect the repository and verify otherwise.

Before setup:
- Inspect the repository and report what exists.
- Do not overwrite or delete existing files without explaining why.
- Identify the package manager and runtime versions if already configured.
- Propose the smallest reliable setup.

## 3. Work in approved milestones

- Implement only the milestone explicitly requested.
- Do not jump ahead or implement future screens “for completeness”.
- Do not make broad refactors during a screen task.
- Before changing shared architecture, explain the reason and expected impact.
- At the end, run the relevant checks and report actual results.
- Stop and wait for approval after each milestone.

## 4. UI reference fidelity

For every screen:
- Inspect the attached reference image carefully.
- Match hierarchy, composition, alignment, spacing, typography, colour, shape, imagery and density.
- Treat the reference as a design specification, not loose inspiration.
- Do not add headers, tabs, cards, buttons, borders or decoration that are not in the reference unless required for functionality or accessibility.
- Do not replace illustrations or character portraits with emoji.
- Do not silently substitute a different image.
- If a reference is ambiguous, ask one focused question rather than guessing.

If the implementation cannot match a detail due to platform constraints, explain the limitation and implement the closest technically sound equivalent.

## 5. Asset protocol — mandatory

Whenever a screen needs an image that is not present:
1. Create a reusable image slot/placeholder at the correct location and aspect ratio.
2. Use the final intended asset filename, not a temporary random filename.
3. Add the asset to `ASSET_MANAGEMENT.md`.
4. Tell the user the exact filename, folder, pixel dimensions, aspect ratio, format, transparency requirement and visual description.
5. Keep the app runnable while the asset is missing.
6. Do not use remote image URLs for core app assets.
7. Do not generate or download assets unless the user explicitly asks you to do so.

For profile portraits, use a consistent collection style. Do not make every avatar look like the same character with a different colour.

## 6. Loading, empty and error states

- Never use a spinner or `ActivityIndicator`.
- Use content-shaped skeletons for asynchronous loading.
- Skeleton dimensions must match the final content to prevent layout shifts.
- Use shimmer only when it does not harm performance or accessibility.
- Empty states must explain what the user can do next.
- Error states must provide a retry path where appropriate.
- Do not show fake data as if it came from the database.

## 7. Engineering quality

- TypeScript strict mode.
- Small components with clear responsibilities.
- No giant `App.tsx` or single-file application.
- Keep game rules independent of presentation.
- Keep persistence behind a repository/service layer.
- Validate external data at boundaries.
- Use accessible labels and minimum practical touch targets.
- Clean up timers, subscriptions, listeners, animation callbacks and gestures.
- Avoid unnecessary dependencies.
- Never commit secrets or service-role keys.
- Do not claim tests passed unless they were run.

## 8. Interaction quality

Every visible control must work. No decorative buttons that do nothing.

For every interaction define:
- Trigger
- State change
- Visual feedback
- Haptic feedback, if appropriate
- Error/edge case behaviour

Use haptics selectively. Do not vibrate continuously or so frequently that the device becomes unpleasant or overheats.

## 9. Technical truthfulness

- A normal mobile app cannot know which person is holding a phone.
- Touch coordinates are not proof of player identity.
- A shared-device app cannot reliably identify players by face or device sensors unless a separate explicit feature is designed and consented to.
- Roulette outcomes must be computed from the actual final wheel angle.
- The default roulette must be fair and unbiased.
- Fairness adjustments, if ever added, must be opt-in and disclosed.
- A local device identifier is not authentication.
- Supabase Row Level Security must not rely on a user-editable device ID as proof of access.

## 10. End-of-milestone report

At the end of each task, report:

1. What was implemented.
2. Files created/changed.
3. Commands run.
4. Test/build results (including failures).
5. Missing assets, with exact specs.
6. Known limitations or bugs.
7. How the user can test it manually.
8. The single next milestone recommended.

Then stop. Do not start the next milestone automatically.
