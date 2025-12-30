// src/pages/manager/Profile/Profile.tsx
import { Image as ImageIcon } from "lucide-react";
import { useProfileForm } from "../../../hooks/useProfileForm";
import { useChangePassword } from "../../../hooks/useChangePassword";
import { useAvatarUpload } from "../../../hooks/useAvatarUpload";
import { createPortal } from "react-dom";
import { useRef } from "react";
import type { ProfileData } from "../../../hooks/useProfile";

type Props = {
  data: {
    loading: boolean;
    profile: ProfileData | null;
    error: string | null;
  };
  form: {
    values: {
      fullName: string;
      role: string;
      address: string;
      phone: string;
      birthday: string;
      email: string;
    };
    isEditing: boolean;
    isSaving: boolean;
    saveError: string | null;
    onChange: ReturnType<typeof useProfileForm>["handleChange"];
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
  };
};

export default function ProfileFormContainer() {
  const { loading, profile, error, form, isEditing, isSaving, saveError, handleChange, startEdit, cancelEdit, saveEdit } = useProfileForm();

  return (
    <ProfileForm
      data={{ loading, profile, error }}
      form={{ values: form, isEditing, isSaving, saveError, onChange: handleChange, onEdit: startEdit, onCancel: cancelEdit, onSave: saveEdit }}
    />
  );
}

function ProfileForm({ data, form }: Props) {
  const { loading, profile, error } = data;
  const { values, isEditing, isSaving, saveError, onChange, onEdit, onCancel, onSave } = form;
  const pwd = useChangePassword();
  const avatar = useAvatarUpload(profile);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-4 space-y-6">
      <h2 className="text-xl font-semibold text-[#1279C3]">Profile</h2>

      <section className="rounded-2xl bg-white p-8 shadow-sm">
        {loading && <div className="text-sm text-slate-500">Loading profile...</div>}
        {!loading && error && <div className="text-sm text-red-600">Failed to load profile: {error}</div>}
        {!loading && !error && saveError && <div className="text-sm text-red-600">Failed to save: {saveError}</div>}
        {!loading && profile && (
          <div className="flex flex-col gap-12 md:flex-row md:items-start">
            {/* Left: form info */}
            <div className="flex-1 space-y-5">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Name</label>
                <input
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-[#1279C3]"
                  value={values.fullName}
                  onChange={onChange("fullName")}
                  readOnly={!isEditing}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-500">Role</label>
                <input
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-[#1279C3]"
                  value={values.role}
                  onChange={onChange("role")}
                  readOnly={!isEditing}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-500">Address</label>
                <input
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-[#1279C3]"
                  value={values.address}
                  onChange={onChange("address")}
                  readOnly={!isEditing}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Phone</label>
                  <input
                    className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-[#1279C3]"
                    value={values.phone}
                    onChange={onChange("phone")}
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Birthday</label>
                  <input
                    type="date"
                    className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-[#1279C3]"
                    value={values.birthday}
                    onChange={onChange("birthday")}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-500">Email</label>
                <input
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-[#1279C3]"
                  value={values.email}
                  readOnly
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-4 md:justify-start">
                <button
                  className="rounded-xl border border-[#1279C3] bg-[#F3F7FC] px-5 py-2 text-xs font-medium text-[#1279C3] hover:bg-[#e5f0ff]"
                  type="button"
                  onClick={pwd.open}
                >
                  Change password
                </button>
                {!isEditing && (
                  <button
                    className="rounded-xl border border-[#DDE4F0] bg-white px-8 py-2 text-xs font-medium text-[#1279C3] hover:bg-[#F3F7FC]"
                    onClick={onEdit}
                    type="button"
                  >
                    Edit
                  </button>
                )}
                {isEditing && (
                  <>
                    <button
                      className="rounded-xl border border-[#1279C3] bg-[#1279C3] px-8 py-2 text-xs font-medium text-white hover:bg-[#0f6aa9]"
                      onClick={onSave}
                      type="button"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="rounded-xl border border-[#DDE4F0] bg-white px-8 py-2 text-xs font-medium text-[#1279C3] hover:bg-[#F3F7FC]"
                      onClick={onCancel}
                      type="button"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right: avatar */}
            <div className="flex w-full justify-center md:w-auto">
              <div className="relative h-80 w-80 overflow-hidden rounded-full border border-slate-200">
                <img src={avatar.avatarUrl || profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />

                <button
                  className="absolute bottom-0 left-0 flex w-full items-center justify-center gap-2 bg-black/30 py-2 text-xs font-medium text-white backdrop-blur"
                  type="button"
                  onClick={handleAvatarClick}
                >
                  <ImageIcon className="h-4 w-4" />
                  {avatar.uploading ? "Uploading..." : "Edit avatar"}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={avatar.onFileChange}
                />
              </div>
            </div>
          </div>
        )}
      </section>
      {avatar.error && <div className="text-sm text-red-600">{avatar.error}</div>}

      {pwd.show &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Change password</h3>
              {pwd.error && <div className="mb-3 text-sm text-red-600">{pwd.error}</div>}
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Current password</label>
                  <input
                    type="password"
                    className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-[#1279C3]"
                    value={pwd.form.currentPassword}
                    onChange={pwd.onChange("currentPassword")}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">New password</label>
                  <input
                    type="password"
                    className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-[#1279C3]"
                    value={pwd.form.newPassword}
                    onChange={pwd.onChange("newPassword")}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="rounded-md border border-[#DDE4F0] bg-white px-4 py-2 text-xs font-medium text-[#1279C3] hover:bg-[#F3F7FC]"
                  type="button"
                  onClick={pwd.close}
                  disabled={pwd.saving}
                >
                  Cancel
                </button>
                <button
                  className="rounded-md border border-[#1279C3] bg-[#1279C3] px-4 py-2 text-xs font-medium text-white hover:bg-[#0f6aa9]"
                  type="button"
                  onClick={pwd.save}
                  disabled={pwd.saving}
                >
                  {pwd.saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
