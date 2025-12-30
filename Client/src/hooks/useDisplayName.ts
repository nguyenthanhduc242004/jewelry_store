import { useEffect, useState } from "react";
import { AuthService } from "../services";
import { extractDisplayName } from "../utils/user.utils";

export function useDisplayName(): string {
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await AuthService.me();
        if (cancelled) return;
        setDisplayName(extractDisplayName(me));
      } catch {
        if (!cancelled) {
          setDisplayName("");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return displayName;
}
