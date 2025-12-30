import type { MeResponse } from "../services/auth.service";

export function extractDisplayName(me: MeResponse | null | undefined): string {
  if (!me?.authenticated) {
    return "";
  }

  if (me.fullName) {
    return me.fullName;
  }

  const fromFullNameClaim = me.claims?.find(
    (c) => /full\s*name/i.test(c.Type) || /fullname/i.test(c.Type)
  )?.Value;

  const fromNameClaim = me.claims?.find(
    (c) => /(.*\/)?name$/i.test(c.Type) && !/nameidentifier/i.test(c.Type)
  )?.Value;

  return fromFullNameClaim ?? me.name ?? fromNameClaim ?? "";
}

export function extractUserId(me: MeResponse | null | undefined): number | null {
  if (!me?.authenticated) {
    return null;
  }

  if (typeof me.userId === "number" && Number.isFinite(me.userId)) {
    return me.userId;
  }

  const idClaim = me.claims?.find(
    (c) => /nameidentifier/i.test(c.Type) || /\/nameidentifier$/i.test(c.Type)
  );
  if (idClaim?.Value) {
    const parsed = Number(idClaim.Value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}