import { createClient, SupabaseClient } from '@supabase/supabase-js';

declare const process: { env: Record<string, string | undefined> };

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('your-project-id')
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return client;
}

export interface CloudMatchRecord {
  id?: string;
  group_id?: string | null;
  circle_id?: string | null;
  circle_name?: string | null;
  game_id: string;
  stakes_mode_id: string;
  dilemma?: string;
  loser_slot_id?: string | null;
  loser_player_name: string;
  winner_player_names?: string[];
  metrics?: Record<string, unknown>;
  created_at?: string;
}

/**
 * Pushes a finished game result to Supabase cloud matches table.
 * If Supabase is not configured or table has not yet been migrated,
 * gracefully handles error without breaking local-first play.
 */
export async function syncMatchToSupabase(match: CloudMatchRecord): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb) {
    return false;
  }

  try {
    const { error } = await sb.from('matches').insert({
      game_id: match.game_id,
      stakes_mode_id: match.stakes_mode_id,
      dilemma: match.dilemma || 'Who Pays?',
      loser_slot_id: match.loser_slot_id || null,
      loser_player_name: match.loser_player_name,
      winner_player_names: match.winner_player_names || [],
      metrics: {
        ...(match.metrics || {}),
        circle_id: match.circle_id || null,
        circle_name: match.circle_name || null,
      },
    });

    if (error) {
      if (
        error.message.includes('schema cache') ||
        error.code === 'PGRST204' ||
        error.code === '42P01'
      ) {
        // Table hasn't been created yet in user's Supabase dashboard
        console.info(
          'ℹ️ [Supabase Sync] Table "public.matches" not found in schema cache. Matches are safely preserved locally in AsyncStorage. Run supabase/schema.sql in your Supabase SQL Editor to enable cloud sync.'
        );
      } else {
        console.warn('Supabase match sync notice:', error.message);
      }
      return false;
    }
    return true;
  } catch {
    // Network or server offline; local storage retains all data
    return false;
  }
}

/**
 * Fetches recent matches from Supabase.
 */
export async function fetchSupabaseMatches(limit = 20): Promise<CloudMatchRecord[]> {
  const sb = getSupabaseClient();
  if (!sb) {
    return [];
  }

  try {
    const { data, error } = await sb
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return data as CloudMatchRecord[];
  } catch (err) {
    console.warn('Error fetching matches from Supabase:', err);
    return [];
  }
}
