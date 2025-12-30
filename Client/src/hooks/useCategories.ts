import { useEffect, useState } from "react";
import { CategoryService, type CategoryDto } from "../services";

export default function useCategories() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await CategoryService.fetchCategories({ signal: controller.signal });
        setCategories(data);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load categories");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  return { categories, loading, error };
}
