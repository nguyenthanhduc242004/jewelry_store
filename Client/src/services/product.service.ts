const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;

export type ProductPreview = {
  id: number;
  name: string;
  material: string;
  imageUrl: string;
  categoryName: string;
  price: number;
  quantity: number;
};

export type ProductGemstone = {
  id: number;
  name: string;
  weight: number;
  size?: string;
  color?: string;
};

export type ProductDetail = {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  material: string;
  description?: string;
  price: number;
  status: boolean;
  quantity: number;
  gemstones: ProductGemstone[];
};

export type UpdateProductDto = {
  name: string;
  material: string;
  description?: string;
  price: number;
  quantity: number;
  categoryId?: number;
};

export type CreateProductDto = {
  name: string;
  material: string;
  description?: string;
  price: number;
  status: boolean;
  categoryId: number;
};

async function fetchProductPreview(
  skip = 0,
  take = 50,
  options?: { signal?: AbortSignal }
): Promise<ProductPreview[]> {
  let url: string;
  if (API_BASE_URL) {
    const u = new URL("/api/Products/preview", API_BASE_URL);
    u.searchParams.set("skip", String(skip));
    u.searchParams.set("take", String(take));
    url = u.toString();
  } else {
    const search = new URLSearchParams({ skip: String(skip), take: String(take) });
    url = `/api/Products/preview?${search.toString()}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    signal: options?.signal
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to fetch product preview: ${response.status} ${response.statusText}${
        body ? ` - ${body}` : ""
      }`
    );
  }

  const data = (await response.json()) as ProductPreview[];
  return data;
}

async function fetchProductById(
  productId: number,
  options?: { signal?: AbortSignal }
): Promise<ProductDetail> {
  let url: string;
  if (API_BASE_URL) {
    url = new URL(`/api/Products/${productId}`, API_BASE_URL).toString();
  } else {
    url = `/api/Products/${productId}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    signal: options?.signal
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to fetch product detail: ${response.status} ${response.statusText}${
        body ? ` - ${body}` : ""
      }`
    );
  }

  return (await response.json()) as ProductDetail;
}

async function updateProduct(
  productId: number,
  payload: UpdateProductDto,
  options?: { signal?: AbortSignal }
): Promise<void> {
  let url: string;
  if (API_BASE_URL) {
    url = new URL(`/api/Products/${productId}`, API_BASE_URL).toString();
  } else {
    url = `/api/Products/${productId}`;
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
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to update product: ${response.status} ${response.statusText}${
        body ? ` - ${body}` : ""
      }`
    );
  }

  // Some endpoints may return 204 No Content
  const text = await response.text();
  if (!text) return;
  try {
    JSON.parse(text);
  } catch {
    // If body is not valid JSON, just return
    return;
  }
}

async function createProduct(
  payload: CreateProductDto,
  options?: { signal?: AbortSignal }
): Promise<ProductDetail> {
  let url: string;
  if (API_BASE_URL) {
    url = new URL("/api/Products", API_BASE_URL).toString();
  } else {
    url = "/api/Products";
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
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to create product: ${response.status} ${response.statusText}${
        body ? ` - ${body}` : ""
      }`
    );
  }

  return (await response.json()) as ProductDetail;
}

export const ProductService = {
  fetchProductPreview,
  fetchProductById,
  updateProduct,
  createProduct
};
