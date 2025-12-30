const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;

export type SupplierDto = {
  id: number;
  name: string;
  address: string;
  phone: string;
};

async function fetchSuppliers(
  skip = 0,
  take = 100,
  options?: { signal?: AbortSignal }
): Promise<SupplierDto[]> {
  let url: string;
  if (API_BASE_URL) {
    const u = new URL("/api/suppliers", API_BASE_URL);
    u.searchParams.set("skip", String(skip));
    u.searchParams.set("take", String(take));
    url = u.toString();
  } else {
    url = `/api/suppliers?skip=${skip}&take=${take}`;
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
      `Failed to fetch suppliers: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as SupplierDto[];
}

async function getSupplierById(
  id: number,
  options?: { signal?: AbortSignal }
): Promise<SupplierDto> {
  const url = API_BASE_URL
    ? new URL(`/api/suppliers/${id}`, API_BASE_URL).toString()
    : `/api/suppliers/${id}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    signal: options?.signal
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch supplier: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as SupplierDto;
}

async function createSupplier(dto: {
  name: string;
  address: string;
  phone: string;
}): Promise<void> {
  const url = API_BASE_URL ? new URL("/api/suppliers", API_BASE_URL).toString() : "/api/suppliers";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    credentials: "include",
    body: JSON.stringify(dto)
  });
  if (!res.ok) {
    let message = `Failed to create supplier (${res.status})`;
    try {
      const data = await res.json();
      if (typeof data?.error === "string" && data.error.trim().length > 0) {
        message = data.error;
      }
    } catch {}
    throw new Error(message);
  }
}

async function updateSupplier(
  id: string,
  dto: { name: string; address: string; phone: string }
): Promise<void> {
  const url = API_BASE_URL
    ? new URL(`/api/suppliers/${id}`, API_BASE_URL).toString()
    : `/api/suppliers/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    credentials: "include",
    body: JSON.stringify(dto)
  });
  if (!res.ok) {
    let message = `Failed to update supplier (${res.status})`;
    try {
      const data = await res.json();
      if (typeof data?.error === "string" && data.error.trim().length > 0) {
        message = data.error;
      }
    } catch {}
    throw new Error(message);
  }
}

async function deleteSupplier(id: string): Promise<void> {
  const url = API_BASE_URL
    ? new URL(`/api/suppliers/${id}`, API_BASE_URL).toString()
    : `/api/suppliers/${id}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Accept: "application/json" },
    credentials: "include"
  });
  if (!res.ok) {
    let message = `Failed to delete supplier (${res.status})`;
    try {
      const data = await res.json();
      if (typeof data?.error === "string" && data.error.trim().length > 0) {
        message = data.error;
      }
    } catch {}
    throw new Error(message);
  }
}

export const SupplierService = {
  fetchSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
