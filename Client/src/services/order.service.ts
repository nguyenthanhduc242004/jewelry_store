const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;

export type OrderDto = {
  id: number;
  userId: number;
  staffId?: number | null;
  totalPrice: number;
  dateCreated: string;
  status: string;
  shippingAddress: string;
  phoneNumber: string;
};

export type OrderSummary = {
  id: number;
  customerName: string;
  totalPrice: number;
  dateCreated: string;
  status: string;
};

export type OrderDetailDto = {
  orderId: number;
  productId: number;
  quantity: number;
  priceAtSale: number;
};

async function fetchOrders(
  skip = 0,
  take = 100,
  options?: { signal?: AbortSignal }
): Promise<OrderDto[]> {
  let url: string;
  if (API_BASE_URL) {
    const u = new URL("/api/orders", API_BASE_URL);
    u.searchParams.set("skip", String(skip));
    u.searchParams.set("take", String(take));
    url = u.toString();
  } else {
    url = `/api/orders?skip=${skip}&take=${take}`;
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
      `Failed to fetch orders: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as OrderDto[];
}

async function fetchOrderSummary(
  skip = 0,
  take = 100,
  options?: { signal?: AbortSignal }
): Promise<OrderSummary[]> {
  let url: string;
  if (API_BASE_URL) {
    const u = new URL("/api/orders/summary", API_BASE_URL);
    u.searchParams.set("skip", String(skip));
    u.searchParams.set("take", String(take));
    url = u.toString();
  } else {
    url = `/api/orders/summary?skip=${skip}&take=${take}`;
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
      `Failed to fetch order summary: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as OrderSummary[];
}

async function fetchOrderById(id: number, options?: { signal?: AbortSignal }): Promise<OrderDto> {
  const url = API_BASE_URL
    ? new URL(`/api/orders/${id}`, API_BASE_URL).toString()
    : `/api/orders/${id}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    signal: options?.signal
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch order: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as OrderDto;
}

async function fetchOrderDetails(
  orderId: number,
  options?: { signal?: AbortSignal }
): Promise<OrderDetailDto[]> {
  const url = API_BASE_URL
    ? new URL(`/api/orders/${orderId}/details`, API_BASE_URL).toString()
    : `/api/orders/${orderId}/details`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    signal: options?.signal
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch order details: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as OrderDetailDto[];
}

async function completeOrder(orderId: number, payload?: { staffId: number }): Promise<void> {
  const url = API_BASE_URL
    ? new URL(`/api/orders/${orderId}/complete`, API_BASE_URL).toString()
    : `/api/orders/${orderId}/complete`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: payload ? JSON.stringify(payload) : undefined
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to complete order: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }
}

async function rejectOrder(orderId: number, payload?: { staffId: number }): Promise<void> {
  const url = API_BASE_URL
    ? new URL(`/api/orders/${orderId}/reject`, API_BASE_URL).toString()
    : `/api/orders/${orderId}/reject`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: payload ? JSON.stringify(payload) : undefined
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to reject order: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }
}

export type CreateOrderDto = {
  userId: number;
  staffId: number;
  dateCreated: string;
  shippingAddress: string;
  phoneNumber: string;
  totalPrice: number;
  status: string;
};

export type AddOrderDetailDto = {
  productId: number;
  quantity: number;
};

async function createOrder(dto: CreateOrderDto): Promise<OrderDto> {
  const url = API_BASE_URL ? new URL("/api/orders", API_BASE_URL).toString() : "/api/orders";

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
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to create order: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as OrderDto;
}

async function addOrderDetail(orderId: number, dto: AddOrderDetailDto): Promise<void> {
  const url = API_BASE_URL
    ? new URL(`/api/orders/${orderId}/details`, API_BASE_URL).toString()
    : `/api/orders/${orderId}/details`;

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
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to add order detail: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }
}

export const OrderService = {
  fetchOrders,
  fetchOrderSummary,
  fetchOrderById,
  fetchOrderDetails,
  completeOrder,
  rejectOrder,
  createOrder,
  addOrderDetail
};
