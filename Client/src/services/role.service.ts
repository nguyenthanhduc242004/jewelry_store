const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;

function buildUrl(path: string): string {
  if (API_BASE_URL) {
    return new URL(path, API_BASE_URL).toString();
  }
  return path;
}

export type RoleDto = { id: number; name: string };

async function getRoleById(id: number, options?: { signal?: AbortSignal }): Promise<RoleDto | null> {
  const url = buildUrl(`/api/roles/${id}`);
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    signal: options?.signal
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as RoleDto;
  return data;
}

export const RoleService = {
  getRoleById
};
