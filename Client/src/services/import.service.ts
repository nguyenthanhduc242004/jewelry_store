const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;
console.log("VITE_API_BASE_URL", API_BASE_URL);

export type ImportDto = {
  id: number;
  supplierId: number;
  staffId?: number | null;
  dateCreated: string;
  totalPrice: number;
};

export type ImportDetailDto = {
  importId: number;
  productId: number;
  quantity: number;
  importPrice: number;
};

async function fetchImports(
  skip = 0,
  take = 100,
  options?: { signal?: AbortSignal }
): Promise<ImportDto[]> {
  let url: string;
  if (API_BASE_URL) {
    const u = new URL("/api/imports", API_BASE_URL);
    u.searchParams.set("skip", String(skip));
    u.searchParams.set("take", String(take));
    url = u.toString();
  } else {
    url = `/api/imports?skip=${skip}&take=${take}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    signal: options?.signal
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch imports: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as ImportDto[];
}

async function fetchImportById(id: number, options?: { signal?: AbortSignal }): Promise<ImportDto> {
  const url = API_BASE_URL
    ? new URL(`/api/imports/${id}`, API_BASE_URL).toString()
    : `/api/imports/${id}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    signal: options?.signal
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch import: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as ImportDto;
}

async function fetchImportDetails(
  importId: number,
  options?: { signal?: AbortSignal }
): Promise<ImportDetailDto[]> {
  const url = API_BASE_URL
    ? new URL(`/api/imports/${importId}/details`, API_BASE_URL).toString()
    : `/api/imports/${importId}/details`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    signal: options?.signal
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch import details: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as ImportDetailDto[];
}

async function createImport(
  importForm: {
    supplierId: number;
    staffId: number;
    dateCreated: string;
    totalPrice: number;
  },
  options?: { signal?: AbortSignal }
): Promise<ImportDto> {
  const url = API_BASE_URL ? new URL("/api/imports", API_BASE_URL).toString() : "/api/imports";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    credentials: "include",
    body: JSON.stringify(importForm),
    signal: options?.signal
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to create import: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as ImportDto;
}

async function addImportDetail(
  importId: number,
  detail: { productId: number; quantity: number },
  options?: { signal?: AbortSignal }
): Promise<void> {
  const url = API_BASE_URL
    ? new URL(`/api/imports/${importId}/details`, API_BASE_URL).toString()
    : `/api/imports/${importId}/details`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    credentials: "include",
    body: JSON.stringify(detail),
    signal: options?.signal
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to add import detail: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }
}

export const ImportService = {
  fetchImports,
  fetchImportById,
  fetchImportDetails,
  createImport,
  addImportDetail
};
