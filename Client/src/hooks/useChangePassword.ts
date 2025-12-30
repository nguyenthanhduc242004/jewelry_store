import { useState } from "react";
import { PasswordService } from "../services/auth.service";

export function useChangePassword() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = () => {
    setShow(true);
    setError(null);
  };

  const close = () => {
    setShow(false);
    setForm({ currentPassword: "", newPassword: "" });
    setError(null);
  };

  const onChange = (field: "currentPassword" | "newPassword") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await PasswordService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return {
    show,
    form,
    saving,
    error,
    open,
    close,
    onChange,
    save
  };
}
