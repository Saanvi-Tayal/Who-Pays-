# COPY-PASTE PROMPTS — WHO PAYS?

Use these prompts in order. Do not send all milestones at once.

## Prompt 0 — Read and plan (send first)

I am starting Who Pays? from scratch. I have provided the complete project documentation pack.

Before coding:
1. Read every Markdown file in the pack, especially `AGENT_RULES.md`, `APP_DEV_PLAN.md`, `UI_DEV_PLAN.md` and `ARCHITECTURE.md`.
2. Inspect the repository and report what currently exists.
3. Summarise the product and the important technical constraints in your own words.
4. Propose the exact stack and compatible dependency versions for the current Expo SDK.
5. Propose the folder structure and state/navigation strategy.
6. Explain how you will handle multi-touch, game state machines, assets, skeleton loading and local-first persistence.
7. Identify risks, unknowns and decisions that need my approval.

Do not write code, install dependencies or create files yet. Wait for my approval.

## Prompt 1 — M1 Project foundation

Implement only **M1 — Project foundation** from `APP_DEV_PLAN.md`, using the approved architecture.

Read `AGENT_RULES.md` and `ARCHITECTURE.md` again before starting.

Do not implement any product screen. Configure the Expo TypeScript project, dependencies, lint/type checks, theme tokens and only the minimal shared primitives required for the foundation.

Use Expo-compatible package versions. Run the app and checks. Update `IMPLEMENTATION_LOG.md`. Report files changed, commands run, test results and blockers. Stop for approval.

## Prompt 2 — M2 Navigation and app state

Implement only **M2 — Navigation and app state foundation**.

Create typed routes and the minimum session state model described in `ARCHITECTURE.md`. Use temporary development placeholders only. Verify navigation and state preservation. Do not implement visual product screens. Update the implementation log and stop.

## Screen prompt template — use for M3 onward

I am attaching the UI reference image(s) for **[SCREEN NAME]**.

Implement only **[MILESTONE ID AND NAME]** from `APP_DEV_PLAN.md`.

Before coding:
1. Read the matching section in `UI_DEV_PLAN.md`.
2. Read the relevant rules in `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `ASSET_MANAGEMENT.md` and `GAME_RULES.md`.
3. Analyse the attached reference image and write a concise Reference Analysis.
4. List the assets required by the reference. If an asset is missing, create a correctly sized placeholder and update `ASSET_MANAGEMENT.md`.

Implementation:
- Match the reference image as closely as possible.
- Use existing design tokens and reusable components.
- Implement the real interactions and state transitions for this milestone.
- Implement loading/empty/error/disabled states that apply.
- Never use spinner/ActivityIndicator.
- Do not implement future milestones.
- Do not break earlier milestones.

Verification:
- Run typecheck/lint and relevant tests.
- Run the app and inspect the screen if possible.
- Compare a screenshot against the reference and fix visible mismatches.
- Update `IMPLEMENTATION_LOG.md`.

At the end, report files changed, tests and commands run, missing assets with exact specs, known issues and manual test steps. Stop and wait for approval.

## Prompt for a mini-game

Implement only **[M7/M8/M9/M10 — GAME NAME]**.

Read `GAME_RULES.md` and the matching arena section in `UI_DEV_PLAN.md`.

Separate the game rules from presentation. Implement the state machine, input handling, timing, scoring and result calculation. Add unit tests for the rules and edge cases. Follow the attached arena reference image exactly. Do not infer physical phone holder identity. Do not generate a result from a separate random call when the visual mechanic itself determines the result.

Do not implement another game. Update the log and stop.

## Prompt for a UI correction pass

Do not add features or redesign this screen.

Compare the current implementation screenshot with the attached reference image. Identify concrete differences in composition, spacing, sizing, typography, colour, image crop, alignment and interaction states. Fix only those differences. Preserve working functionality and shared components. Run relevant checks and report what changed.

## Prompt for final integration

Implement only the final milestone approved by me. Read `QA_TEST_PLAN.md` and execute the relevant regression checklist. Do not claim tests passed unless you ran them. Update the implementation log and provide a release-readiness report.
