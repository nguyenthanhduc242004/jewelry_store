const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;

export type CategoryDto = {
  id: number;
  name: string;
};

async function fetchCategories(options?: { signal?: AbortSignal }): Promise<CategoryDto[]> {
  let url: string;
  if (API_BASE_URL) {
    url = new URL("/api/Categories", API_BASE_URL).toString();
  } else {
    url = "/api/Categories";
  }

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: options?.signal,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to fetch categories: ${response.status} ${response.statusText}${body ? ` - ${body}` : ""}`,
    );
  }

  return (await response.json()) as CategoryDto[];
}

export const CategoryService = {
  fetchCategories,
};
