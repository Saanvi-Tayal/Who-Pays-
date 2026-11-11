# DATA MODEL & SUPABASE PLAN — WHO PAYS?

## 1. Principles

- First game must work without an account or network.
- Naming and logging are optional.
- A player slot is not the same thing as a saved player identity.
- A match loss is not automatically a bill payment.
- Store only information needed for the product.
- Do not use a client-generated device ID as an authentication boundary.
- Supabase service-role credentials must never be included in the mobile app.

## 2. Local-first phases

### Phase A — local play
Keep the active session in memory. Persist optional match history locally through a repository interface.

### Phase B — cloud history
Introduce Supabase after the core flow works. Decide the access model before enabling writes:
- Anonymous Supabase Auth user per installation/session, or
- Explicit group invite/access mechanism.

A random local ID may be used as a lookup key but is not sufficient security by itself.

## 3. Suggested tables

### `groups`
- `id` UUID primary key.
- `owner_user_id` UUID references auth user.
- `name` text nullable.
- `created_at` timestamptz.

### `players`
- `id` UUID primary key.
- `owner_user_id` UUID references auth user.
- `display_name` text nullable.
- `avatar_key` text nullable.
- `created_at` timestamptz.
- `updated_at` timestamptz.

### `group_players`
- `group_id` UUID references groups.
- `player_id` UUID references players.
- `created_at` timestamptz.
- Composite primary key `(group_id, player_id)`.

### `matches`
- `id` UUID primary key.
- `group_id` UUID nullable references groups.
- `created_by_user_id` UUID references auth user.
- `game_id` text.
- `stakes_mode_id` text.
- `outcome` text.
- `started_at` timestamptz.
- `finished_at` timestamptz.
- `metrics` JSONB.
- `created_at` timestamptz.

### `match_participants`
- `id` UUID primary key.
- `match_id` UUID references matches.
- `player_id` UUID nullable references players.
- `player_slot_id` text.
- `display_name_snapshot` text nullable.
- `avatar_key_snapshot` text nullable.
- `colour_key` text.
- `result_role` text (winner, loser, participant, false_start, timeout).
- `metrics` JSONB.
- Unique constraint `(match_id, player_slot_id)`.

### Optional `consequences`
Only add if the product needs to record whether a consequence was actually completed:
- `id` UUID primary key.
- `match_id` UUID references matches.
- `consequence_type` text.
- `status` text.
- `completed_at` timestamptz nullable.

## 4. Statistics definitions

Do not use ambiguous labels.

- **Games played:** count of matches in which a player participated.
- **Games lost:** count of participant rows marked loser (define false-start treatment explicitly).
- **Bills paid:** count only confirmed Who Pays? consequences marked paid, not every game loss.
- **Win rate:** wins divided by decided games; exclude ties/no-contest.
- **Losing streak:** consecutive decided losses ordered by finish time.

Display “not enough data” instead of a misleading percentage when sample size is too small.

## 5. Security and RLS

Before production:
- Enable RLS on every user/group-owned table.
- Write policies for select/insert/update/delete.
- Verify users cannot read or mutate another user's groups or matches.
- Ensure group sharing has an explicit membership/permission model.
- Test policies using separate users.
- Never trust a `group_id` supplied by the client without checking membership.
- Never put Supabase service-role key in Expo public environment variables.

If the first version uses private per-user groups only, keep the policy simple and do not imply cross-user collaboration exists.

## 6. Repository contract

Screens call application services/use cases, not Supabase directly.

Example conceptual operations:
- `saveMatch(match)`
- `getRecentMatches(groupId, limit)`
- `getPlayerStats(groupId)`
- `createPlayer(input)`
- `updatePlayer(playerId, patch)`
- `associateSlotWithPlayer(matchId, slotId, playerId)`

Implement local and cloud repositories behind a stable interface where practical.

## 7. Offline and error behaviour

- Game play never depends on a cloud request.
- A failed save must retain the result locally.
- Show pending/sync-failed status.
- Provide retry.
- Avoid duplicate matches with an idempotency key or stable client-generated match UUID.
- Do not silently discard unsynced results.
