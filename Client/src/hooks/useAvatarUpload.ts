import { useEffect, useState } from "react";
import { UploadService, UserService } from "../services";
import type { ProfileData } from "./useProfile";

export function useAvatarUpload(profile: ProfileData | null) {
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAvatarUrl(profile?.avatarUrl ?? "");
  }, [profile]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setError(null);
    setUploading(true);
    try {
      const url = await UploadService.uploadImage(file);
      await UserService.updateUserImage(profile.id, url);
      setAvatarUrl(url);
      localStorage.setItem("avatarUrl", url);
      window.dispatchEvent(new Event("avatar-updated"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return {
    avatarUrl,
    uploading,
    error,
    onFileChange,
  };
}
