const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;

export type RevenueData = {
  totalRevenue: number;
  percentChange: number;
  thisWeekData: Array<{ day: string; revenue: number }>;
  lastWeekData: Array<{ day: string; revenue: number }>;
};

export type TopProduct = {
  productName: string;
  quantity: number;
};

export type TopCustomer = {
  customerName: string;
  totalSpent: number;
};

export type OrderStats = Array<{
  day: string;
  thisWeek: number;
  lastWeek: number;
}>;

async function fetchRevenue(options?: { signal?: AbortSignal }): Promise<RevenueData> {
  const url = API_BASE_URL
    ? new URL("/api/dashboard/revenue", API_BASE_URL).toString()
    : "/api/dashboard/revenue";

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    signal: options?.signal
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch revenue: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as RevenueData;
}

async function fetchTopProducts(options?: { signal?: AbortSignal }): Promise<TopProduct[]> {
  const url = API_BASE_URL
    ? new URL("/api/dashboard/top-products", API_BASE_URL).toString()
    : "/api/dashboard/top-products";

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    signal: options?.signal
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch top products: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as TopProduct[];
}

async function fetchTopCustomers(options?: { signal?: AbortSignal }): Promise<TopCustomer[]> {
  const url = API_BASE_URL
    ? new URL("/api/dashboard/top-customers", API_BASE_URL).toString()
    : "/api/dashboard/top-customers";

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    signal: options?.signal
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch top customers: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as TopCustomer[];
}

async function fetchOrderStats(options?: { signal?: AbortSignal }): Promise<OrderStats> {
  const url = API_BASE_URL
    ? new URL("/api/dashboard/order-stats", API_BASE_URL).toString()
    : "/api/dashboard/order-stats";

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    signal: options?.signal
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch order stats: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`
    );
  }

  return (await res.json()) as OrderStats;
}

export const DashboardService = {
  fetchRevenue,
  fetchTopProducts,
  fetchTopCustomers,
  fetchOrderStats
};
