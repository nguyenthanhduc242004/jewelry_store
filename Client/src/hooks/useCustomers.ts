import { useEffect, useState } from "react";
import { UserService } from "../services/user.service";
import type { CustomerRow } from "../components/Customer/CustomerTable/CustomerTable";
import { displayOrDash } from "../utils/display";

let customerCache: CustomerRow[] = [];

export function useCustomers(skip = 0, take = 200) {
  const [rows, setRows] = useState<CustomerRow[]>(customerCache);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const data = await UserService.fetchUserSummary(skip, take, { signal: controller.signal });
        const filtered = data.filter((u) => (u.role ?? "").toLowerCase() === "customer");
        const mapped: CustomerRow[] = filtered.map((u) => ({
          id: u.id,
          name: displayOrDash(u.fullName),
          imageUrl: u.imageUrl || "/img/avt.png",
          address: displayOrDash(u.address),
          phone: displayOrDash(u.phone),
          email: displayOrDash(u.email)
        }));
        customerCache = mapped;
        setRows(mapped);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [skip, take]);

  return { rows, error, loading };
}
