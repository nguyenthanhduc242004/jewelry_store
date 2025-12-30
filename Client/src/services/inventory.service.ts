const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;

export type InventoryItem = {
  productId: number;
  quantity: number;
};

async function updateInventory(
  productId: number,
  payload: InventoryItem,
  options?: { signal?: AbortSignal },
): Promise<void> {
  let url: string;
  if (API_BASE_URL) {
    url = new URL(`/api/Inventory/${productId}`, API_BASE_URL).toString();
  } else {
    url = `/api/Inventory/${productId}`;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: options?.signal,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to update inventory: ${response.status} ${response.statusText}${body ? ` - ${body}` : ""}`,
    );
  }
}

export const InventoryService = {
  updateInventory,
};
