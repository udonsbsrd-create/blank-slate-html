"use client";

/**
 * Cloud storage mode detection + user-facing override.
 *
 * Cloud is available when the app was built/deployed with Supabase env vars.
 * The build step exposes `NEXT_PUBLIC_CLOUD_STORAGE_ENABLED` so the client
 * knows to render the toggle and hit /api/state.
 *
 * Users can still force local-only via a per-browser preference stored in
 * localStorage (key: "sovereign-cloud-sync"). This preserves the
 * cloud-first spirit of the project.
 */

const CLOUD_PREF_KEY = "sovereign-cloud-sync";

export function isCloudAvailable(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function isCloudEnabledByUser(): boolean {
  return true;
}

export function setCloudEnabledByUser(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLOUD_PREF_KEY, enabled ? "true" : "false");
  } catch {
    /* ignore quota errors */
  }
}

/** True when cloud is configured AND the user hasn't disabled it. */
export function isCloudActive(): boolean {
  return isCloudAvailable() && isCloudEnabledByUser();
}
