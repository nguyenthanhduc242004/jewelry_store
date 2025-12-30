const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;

export type CreateGemstoneDto = {
  productId: number;
  name: string;
  weight: number;
  size?: string;
  color?: string;
};

async function createGemstone(
  payload: CreateGemstoneDto,
  options?: { signal?: AbortSignal }
): Promise<void> {
  let url: string;
  if (API_BASE_URL) {
    url = new URL("/api/Gemstones", API_BASE_URL).toString();
  } else {
    url = "/api/Gemstones";
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal: options?.signal
  });

  if (!response.ok) {
    let errorMessage = `Failed to create gemstone: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
      if (errorData.details) {
        errorMessage += ` - ${errorData.details}`;
      }
    } catch {
      const text = await response.text().catch(() => "");
      if (text) {
        errorMessage += ` - ${text}`;
      }
    }
    throw new Error(errorMessage);
  }

  const text = await response.text();
  if (!text) return;
  try {
    JSON.parse(text);
  } catch {
    return;
  }
}

async function updateGemstone(
  gemstoneId: number,
  payload: CreateGemstoneDto,
  options?: { signal?: AbortSignal }
): Promise<void> {
  let url: string;
  if (API_BASE_URL) {
    url = new URL(`/api/Gemstones/${gemstoneId}`, API_BASE_URL).toString();
  } else {
    url = `/api/Gemstones/${gemstoneId}`;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal: options?.signal
  });

  if (!response.ok) {
    let errorMessage = `Failed to update gemstone: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
      if (errorData.details) {
        errorMessage += ` - ${errorData.details}`;
      }
    } catch {
      const text = await response.text().catch(() => "");
      if (text) {
        errorMessage += ` - ${text}`;
      }
    }
    throw new Error(errorMessage);
  }

  const text = await response.text();
  if (!text) return;
  try {
    JSON.parse(text);
  } catch {
    return;
  }
}

async function deleteGemstone(
  gemstoneId: number,
  options?: { signal?: AbortSignal }
): Promise<void> {
  let url: string;
  if (API_BASE_URL) {
    url = new URL(`/api/Gemstones/${gemstoneId}`, API_BASE_URL).toString();
  } else {
    url = `/api/Gemstones/${gemstoneId}`;
  }

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json"
    },
    signal: options?.signal
  });

  if (!response.ok) {
    let errorMessage = `Failed to delete gemstone: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
      if (errorData.details) {
        errorMessage += ` - ${errorData.details}`;
      }
    } catch {
      const text = await response.text().catch(() => "");
      if (text) {
        errorMessage += ` - ${text}`;
      }
    }
    throw new Error(errorMessage);
  }
}

export const GemstoneService = {
  createGemstone,
  updateGemstone,
  deleteGemstone
};
