# WHO PAYS? — Project Documentation Pack

This folder is the source of truth for building **Who Pays?** from a completely empty project.

## How to use this pack

1. Give your coding agent the entire `who_pays_project_docs` folder (or extract this ZIP into the project root).
2. Give it `AGENT_RULES.md` and `APP_DEV_PLAN.md` first.
3. Ask it to read all Markdown files before creating files or writing code.
4. Ask it to return an implementation proposal and wait for your approval.
5. Implement only one milestone at a time. Do not ask the agent to build the entire app in one prompt.
6. Attach the relevant UI reference image whenever implementing a screen. The reference image is authoritative for visual design.

## Document map

| File | Purpose |
|---|---|
| `APP_DEV_PLAN.md` | End-to-end product scope, milestones, dependencies, acceptance criteria and build order |
| `UI_DEV_PLAN.md` | Screen-by-screen UI implementation plan and visual fidelity rules |
| `ARCHITECTURE.md` | Technical architecture, navigation, state ownership, folder structure and engineering decisions |
| `DESIGN_SYSTEM.md` | Design tokens, component rules, motion, haptics and responsive behaviour |
| `ASSET_MANAGEMENT.md` | Image inventory, naming, dimensions, placeholders and handoff process |
| `GAME_RULES.md` | Precise rules, state machines and edge cases for each mini-game |
| `DATA_MODEL.md` | Supabase schema, privacy model, persistence and query expectations |
| `AGENT_RULES.md` | Exact operating instructions for the coding agent |
| `QA_TEST_PLAN.md` | Functional, visual, device and regression testing checklist |
| `IMPLEMENTATION_LOG.md` | Required record of decisions, completed work, known issues and next task |
| `PROMPTS.md` | Copy-paste prompts to start the agent and execute each milestone |

## Important product decisions

- The first release is a **single-device, pass-the-phone** party game.
- The app can detect touches, but cannot identify which human is physically holding the device. Games must use explicit player hand-off/confirmation where needed.
- A player’s colour is stable for the duration of a match.
- Default roulette is unbiased. No hidden probability manipulation.
- Names are optional. A match can be played and logged anonymously.
- The app must work locally without Supabase configured. Cloud persistence is added in its own milestone.
- Every screen must have loading, empty, error and success states where applicable. Use skeletons instead of spinner indicators.
- Never invent missing assets. Create labelled placeholders and update `ASSET_MANAGEMENT.md`.
- Reference images define the screen design. Do not redesign them.

## First action

Start with the prompt in `PROMPTS.md` under **Prompt 0 — Read and plan**. Do not start coding until the agent has read the docs and returned its plan.
