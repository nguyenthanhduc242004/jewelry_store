const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;

export type ProductImage = {
  productId: number;
  imageOrder: number;
  imageUrl: string;
};

export type CreateProductImageDto = {
  imageOrder: number;
  imageUrl: string;
};

async function fetchProductImages(productId: number, options?: { signal?: AbortSignal }): Promise<ProductImage[]> {
  let url: string;
  if (API_BASE_URL) {
    url = new URL(`/api/products/${productId}/images`, API_BASE_URL).toString();
  } else {
    url = `/api/products/${productId}/images`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: options?.signal,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to fetch product images: ${response.status} ${response.statusText}${body ? ` - ${body}` : ""}`,
    );
  }

  return (await response.json()) as ProductImage[];
}

async function createProductImage(
  productId: number,
  payload: CreateProductImageDto,
  options?: { signal?: AbortSignal },
): Promise<ProductImage> {
  let url: string;
  if (API_BASE_URL) {
    url = new URL(`/api/products/${productId}/images`, API_BASE_URL).toString();
  } else {
    url = `/api/products/${productId}/images`;
  }

  const response = await fetch(url, {
    method: "POST",
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
      `Failed to create product image: ${response.status} ${response.statusText}${body ? ` - ${body}` : ""}`,
    );
  }

  return (await response.json()) as ProductImage;
}

async function deleteProductImage(
  productId: number,
  imageOrder: number,
  options?: { signal?: AbortSignal },
): Promise<void> {
  let url: string;
  if (API_BASE_URL) {
    url = new URL(`/api/products/${productId}/images/${imageOrder}`, API_BASE_URL).toString();
  } else {
    url = `/api/products/${productId}/images/${imageOrder}`;
  }

  const response = await fetch(url, {
    method: "DELETE",
    headers: { Accept: "application/json" },
    signal: options?.signal,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to delete product image: ${response.status} ${response.statusText}${body ? ` - ${body}` : ""}`,
    );
  }
}

export const ProductImageService = {
  fetchProductImages,
  createProductImage,
  deleteProductImage,
};

