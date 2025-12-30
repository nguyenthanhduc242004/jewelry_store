import { useEffect, useState } from "react";
import { SupplierService } from "../services";
import type { SupplierRow } from "../components/Supplier/SupplierTable/SupplierTable";
import { displayOrDash } from "../utils/display";

let supplierCache: SupplierRow[] = [];

export function useSuppliers(skip = 0, take = 100) {
  const [rows, setRows] = useState<SupplierRow[]>(supplierCache);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refetch = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const data = await SupplierService.fetchSuppliers(skip, take, {
          signal: controller.signal
        });
        const mapped: SupplierRow[] = data.map((s) => ({
          id: `SUP${s.id.toString().padStart(3, "0")}`,
          name: displayOrDash(s.name),
          address: displayOrDash(s.address),
          phone: displayOrDash(s.phone)
        }));
        supplierCache = mapped;
        setRows(mapped);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load suppliers");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [skip, take, refreshTrigger]);

  return { rows, error, loading, refetch };
}
