const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;

export type CartItemDto = {
  productId: number;
  quantity: number;
  priceAtAdd: number;
  productName: string;
  productImage?: string;
};

export type CartDto = {
  id: number;
  userId: number;
  dateCreated: string;
  dateModified: string;
  status: string;
  items: CartItemDto[];
  totalPrice: number;
};

export type AddProductDto = {
  productId: number;
  quantity: number;
};

export type UpdateQuantityDto = {
  productId: number;
  quantity: number;
};

export type OrderInfoDto = {
  shippingAddress?: string;
  phoneNumber?: string;
};

function buildUrl(path: string): string {
  if (API_BASE_URL) {
    return new URL(path, API_BASE_URL).toString();
  }
  return path;
}

async function getMyCart(options?: { signal?: AbortSignal }): Promise<CartDto> {
  const response = await fetch(buildUrl("/api/carts/my-cart"), {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    credentials: "include",
    signal: options?.signal
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to fetch cart: ${response.status} ${response.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await response.json()) as CartDto;
}

async function addProduct(dto: AddProductDto, options?: { signal?: AbortSignal }): Promise<void> {
  const response = await fetch(buildUrl("/api/carts/add-product"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    credentials: "include",
    body: JSON.stringify(dto),
    signal: options?.signal
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to add product to cart: ${response.status} ${response.statusText}${
        body ? ` - ${body}` : ""
      }`
    );
  }
}

async function removeProduct(productId: number, options?: { signal?: AbortSignal }): Promise<void> {
  const response = await fetch(buildUrl(`/api/carts/remove-product/${productId}`), {
    method: "DELETE",
    headers: {
      Accept: "application/json"
    },
    credentials: "include",
    signal: options?.signal
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to remove product from cart: ${response.status} ${response.statusText}${
        body ? ` - ${body}` : ""
      }`
    );
  }
}

async function updateQuantity(
  dto: UpdateQuantityDto,
  options?: { signal?: AbortSignal }
): Promise<void> {
  const response = await fetch(buildUrl("/api/carts/update-quantity"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    credentials: "include",
    body: JSON.stringify(dto),
    signal: options?.signal
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to update quantity: ${response.status} ${response.statusText}${
        body ? ` - ${body}` : ""
      }`
    );
  }
}

async function confirmCart(
  orderInfo: OrderInfoDto,
  options?: { signal?: AbortSignal }
): Promise<{ orderId: number }> {
  const response = await fetch(buildUrl("/api/carts/confirm"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    credentials: "include",
    body: JSON.stringify(orderInfo),
    signal: options?.signal
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to confirm cart: ${response.status} ${response.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await response.json()) as { orderId: number };
}

async function clearCart(options?: { signal?: AbortSignal }): Promise<void> {
  const response = await fetch(buildUrl("/api/carts/clear"), {
    method: "DELETE",
    headers: {
      Accept: "application/json"
    },
    credentials: "include",
    signal: options?.signal
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to clear cart: ${response.status} ${response.statusText}${body ? ` - ${body}` : ""}`
    );
  }
}

export const CartService = {
  getMyCart,
  addProduct,
  removeProduct,
  updateQuantity,
  confirmCart,
  clearCart
};
