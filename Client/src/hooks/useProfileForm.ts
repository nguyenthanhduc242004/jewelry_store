import { useEffect, useState } from "react";
import type { ProfileData } from "./useProfile";
import { useProfile } from "./useProfile";
import { UserService } from "../services";

type FormState = {
  fullName: string;
  role: string;
  address: string;
  phone: string;
  birthday: string;
  email: string;
};

const toDateInputValue = (value: string | null | undefined): string => {
  if (!value) return "";
  const parts = value.split("T");
  return parts[0] ?? "";
};

const toUtcDateString = (value: string): string | null => {
  if (!value) return null;
  return `${value}T00:00:00Z`;
};

const toFormState = (profile: ProfileData | null): FormState => ({
  fullName: profile?.fullName ?? "",
  role: profile?.role ?? "",
  address: profile?.address ?? "",
  phone: profile?.phone ?? "",
  birthday: toDateInputValue(profile?.birthday),
  email: profile?.email ?? "",
});

export function useProfileForm() {
  const { loading, profile, error } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormState>(toFormState(null));
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setForm(toFormState(profile));
    setIsEditing(false);
  }, [profile]);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value as FormState[keyof FormState] }));
    };

  const startEdit = () => setIsEditing(true);

  const cancelEdit = () => {
    setForm(toFormState(profile));
    setIsEditing(false);
  };

  const saveEdit = async () => {
      if (!profile) return;
      setIsSaving(true);
      setSaveError(null);
      try {
        const birthdayIso = toUtcDateString(form.birthday);
        await UserService.updateUser(profile.id, {
          fullName: form.fullName,
          email: profile.email,
          phone: form.phone,
          address: form.address || null,
          birthday: birthdayIso,
          status: profile.status
        });
        setIsEditing(false);
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Failed to save profile");
      } finally {
        setIsSaving(false);
      }
  };

  return {
    loading,
    profile,
    error,
    form,
    isEditing,
    isSaving,
    saveError,
    handleChange,
    startEdit,
    cancelEdit,
    saveEdit,
  };
}
