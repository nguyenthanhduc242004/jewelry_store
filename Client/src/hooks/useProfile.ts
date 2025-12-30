import { useEffect, useState } from "react";
import { AuthService, UserService } from "../services";
import { extractUserId } from "../utils/user.utils";

const DEFAULT_AVATAR = "/img/avt.png";

export type ProfileData = {
  id: number;
  fullName: string;
  role?: string;
  roles?: string[];
  email: string;
  phone: string;
  address: string | null;
  birthday: string | null;
  status: boolean; 
  avatarUrl: string;
};

type State =
  | { loading: true; profile: null; error: null }
  | { loading: false; profile: ProfileData | null; error: string | null };

export function useProfile(): State {
  const [state, setState] = useState<State>({ loading: true, profile: null, error: null });

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        const me = await AuthService.me({ signal: controller.signal });
        if (cancelled) return;
        if (!me?.authenticated) {
          setState({ loading: false, profile: null, error: "Unauthenticated" });
          return;
        }

        const userId = extractUserId(me);
        if (!userId) {
          setState({ loading: false, profile: null, error: "User id not found" });
          return;
        }

        const [user, image] = await Promise.all([
          UserService.getUserById(userId, { signal: controller.signal }),
          UserService.getUserImage(userId, { signal: controller.signal })
        ]);

        let roleName = user.role ?? "";

        if (cancelled) return;
        setState({
          loading: false,
          profile: {
            ...user,
            role: roleName,
            roles: roleName ? [roleName] : undefined,
            avatarUrl: image?.imageUrl || DEFAULT_AVATAR
          },
          error: null
        });
      } catch (err) {
        if (!cancelled) {
          setState({ loading: false, profile: null, error: err instanceof Error ? err.message : "Failed to load profile" });
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return state;
}
