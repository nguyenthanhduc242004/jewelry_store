const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;
const isDev = !!import.meta.env.DEV;
const log = (...args: unknown[]) => {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.log("[auth.checkAuth]", ...args);
  }
};

type AuthInfo = {
  authenticated: boolean;
  name?: string;
  userId?: string;
  fullName?: string;
  roles?: string[];
  claims?: Array<{ type: string; value: string }>;
};

let inflight: Promise<AuthInfo> | null = null;
let last: { value: AuthInfo; at: number } | null = null;
const CACHE_MS = 3000;

export async function checkAuth(signal?: AbortSignal): Promise<AuthInfo> {
  const now = Date.now();
  if (last && last.value.authenticated === true && now - last.at < CACHE_MS) {
    log("cache hit (authed)", { cachedAtMs: last.at, ageMs: now - last.at });
    return last.value;
  }
  if (inflight) {
    log("reuse inflight request");
    return inflight;
  }
  inflight = (async () => {
    try {
      const url = API_BASE_URL ? new URL("/api/auth/me", API_BASE_URL).toString() : "/api/auth/me";
      log("request", { url });
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
        signal
      });
      log("response", { status: res.status, ok: res.ok });
      if (!res.ok) return { authenticated: false };
      const data = (await res.json()) as AuthInfo;
      const value: AuthInfo = {
        authenticated: Boolean(data?.authenticated),
        name: data?.name,
        userId: data?.userId,
        fullName: data?.fullName,
        roles: data?.roles,
        claims: data?.claims
      };
      log("parsed", value);
      last = value.authenticated ? { value, at: Date.now() } : null;
      return value;
    } catch {
      log("error while checking auth (treat as unauthenticated)");
      return { authenticated: false };
    } finally {
      log("done");
      inflight = null;
    }
  })();
  return inflight;
}
