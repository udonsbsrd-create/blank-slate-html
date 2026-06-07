/**
 * lib/server/credits-helper.ts
 *
 * Server-side functions for credit enforcement.
 * Uses Supabase RPC to call the atomic spend_credits() Postgres function.
 * All enforcement is race-condition-safe because the deduction happens
 * in a single UPDATE ... WHERE credits_remaining >= cost statement
 * inside a Postgres transaction.
 */

import { getServerSupabase } from "./supabase";
import { CREDIT_COSTS, type CreditAction } from "../credits";

export type SpendResult =
  | { ok: true; remaining: number }
  | { ok: false; error: "insufficient_credits" | "user_not_found" | "db_unavailable" | string };

/**
 * Provision a user's credit row if it doesn't exist yet.
 * Call this lazily on first hit — no need for a sign-up webhook.
 */
export async function ensureUser(userId: string, plan = "free", email?: string | null): Promise<void> {
  const supabase = getServerSupabase();
  if (!supabase) return;

  await supabase.rpc("ensure_user_credits", {
    p_user_id: userId,
    p_plan: plan,
    p_email: email || null,
  });
}

/**
 * Atomically spend credits for an action.
 *
 * 1. Provisions the user row if missing (first-time user).
 * 2. Calls spend_credits() RPC — a single atomic Postgres UPDATE.
 * 3. Returns ok=true + remaining balance, or ok=false + reason.
 *
 * Usage in an API route:
 *   const result = await spendCredits(userId, 'scrape');
 *   if (!result.ok) return NextResponse.json({ error: result.error }, { status: 402 });
 */
export async function spendCredits(
  userId: string,
  action: CreditAction,
  metadata?: Record<string, unknown>,
): Promise<SpendResult> {
  const supabase = getServerSupabase();
  if (!supabase) {
    // Supabase not configured — allow the action through (dev mode / no DB)
    return { ok: true, remaining: 999 };
  }

  const cost = CREDIT_COSTS[action];

  // First, ensure the user exists
  const { error: ensureError } = await supabase.rpc("ensure_user_credits", {
    p_user_id: userId,
    p_plan: "free",
  });

  if (ensureError) {
    console.error("[credits] ensure_user_credits error:", ensureError);
    // Don't block the user on a DB error — log and allow through
    return { ok: true, remaining: -1 };
  }

  // Atomically deduct
  const { data, error } = await supabase.rpc("spend_credits", {
    p_user_id: userId,
    p_action: action,
    p_cost: cost,
    p_metadata: metadata ?? null,
  });

  if (error) {
    console.error("[credits] spend_credits error:", error);
    return { ok: true, remaining: -1 }; // Fail open — log but don't block
  }

  const result = data as { ok: boolean; remaining?: number; error?: string };

  if (!result.ok) {
    return { ok: false, error: result.error ?? "unknown" };
  }

  return { ok: true, remaining: result.remaining ?? 0 };
}

/**
 * Refund credits (e.g. if an API call fails after deduction).
 * Uses the same atomic RPC but passes negative cost.
 */
export async function refundCredits(
  userId: string,
  action: CreditAction,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const supabase = getServerSupabase();
  if (!supabase) return;

  const cost = CREDIT_COSTS[action];

  await supabase.rpc("spend_credits", {
    p_user_id: userId,
    p_action: `${action}_refund`,
    p_cost: -cost, // negative cost adds back the credit
    p_metadata: metadata ?? null,
  });
}

/**
 * Get the current credit balance for a user without spending anything.
 * Used to show balance in the UI.
 */
export async function getBalance(
  userId: string,
): Promise<{ remaining: number; limit: number; plan: string } | null> {
  const supabase = getServerSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("user_credits")
    .select("credits_remaining, credits_limit, plan")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    remaining: data.credits_remaining,
    limit: data.credits_limit,
    plan: data.plan,
  };
}

export type UsageEvent = {
  id: string;
  action: string;
  credits_cost: number;
  created_at: string;
  metadata?: any;
};

export async function getUsageHistory(userId: string): Promise<UsageEvent[]> {
  const supabase = getServerSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("usage_events")
    .select("id, action, credits_cost, created_at, metadata")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data;
}
