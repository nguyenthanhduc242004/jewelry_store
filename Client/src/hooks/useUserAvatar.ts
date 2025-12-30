import { useEffect, useState } from "react";
import { AuthService, UserService } from "../services";
import { extractUserId } from "../utils/user.utils";

const DEFAULT_AVATAR = "/img/avt.png";
const AVATAR_KEY = "avatarUrl";

export function useUserAvatar(): string {
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    const cached = typeof window !== "undefined" ? localStorage.getItem(AVATAR_KEY) : null;
    return cached && cached.trim().length > 0 ? cached : DEFAULT_AVATAR;
  });

  useEffect(() => {
    let cancelled = false;

    const fetchAvatar = async () => {
      try {
        const me = await AuthService.me();
        if (cancelled) return;

        const userId = extractUserId(me);
        if (!userId) {
          setAvatarUrl(DEFAULT_AVATAR);
          localStorage.removeItem(AVATAR_KEY);
          return;
        }

        const data = await UserService.getUserImage(userId);
        if (!cancelled && data?.imageUrl) {
          setAvatarUrl(data.imageUrl);
          localStorage.setItem(AVATAR_KEY, data.imageUrl);
        } else if (!cancelled) {
          setAvatarUrl(DEFAULT_AVATAR);
          localStorage.removeItem(AVATAR_KEY);
        }
      } catch {
        if (!cancelled) {
          setAvatarUrl(DEFAULT_AVATAR);
          localStorage.removeItem(AVATAR_KEY);
        }
      }
    };

    fetchAvatar();

    const handler = () => {
      fetchAvatar();
    };
    window.addEventListener("avatar-updated", handler);
    window.addEventListener("storage", handler);

    return () => {
      cancelled = true;
      window.removeEventListener("avatar-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return avatarUrl;
}

