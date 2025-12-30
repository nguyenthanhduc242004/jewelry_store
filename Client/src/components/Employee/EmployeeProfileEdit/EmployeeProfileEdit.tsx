import React from "react";
import { type Employee } from "../EmployeeProfile/EmployeeProfile";

type Props = {
  value: Employee;
  onChange: (next: Employee) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function EmployeeProfileEdit({
  value,
  onChange,
  onSave,
  onCancel,
}: Props) {
  const handleFieldChange =
    (field: keyof Employee) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange({ ...value, [field]: e.target.value });
    };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    onChange({ ...value, avatarUrl: url });
    // upload file lên server, lấy url thật rồi set lại
  };

  return (
    <div className="w-full flex justify-center mt-2">
      <div className="max-w-5xl w-full flex gap-16">
        {/* Left: form */}
        <div className="flex-1">
          <div className="space-y-3 text-sm">
            <InfoRow label="Name:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={value.name}
                onChange={handleFieldChange("name")}
              />
            </InfoRow>

            <InfoRow label="Address:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={value.address}
                onChange={handleFieldChange("address")}
              />
            </InfoRow>

            <InfoRow label="Phone number:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={value.phone}
                onChange={handleFieldChange("phone")}
              />
            </InfoRow>

            <InfoRow label="Email:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={value.email}
                onChange={handleFieldChange("email")}
              />
            </InfoRow>

            <InfoRow label="Birthday:">
              <input
                type="date"
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={value.birthday}
                onChange={handleFieldChange("birthday")}
              />
            </InfoRow>

            <InfoRow label="Position:">
              <select
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={value.position}
                onChange={handleFieldChange("position")}
              >
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
                <option value="Intern">Intern</option>
              </select>
            </InfoRow>

            <InfoRow label="Account:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={value.account}
                onChange={handleFieldChange("account")}
              />
            </InfoRow>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="min-w-[120px] rounded border border-red-200 bg-red-50 px-6 py-2 text-sm font-medium text-red-500 hover:bg-red-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="min-w-[120px] rounded border border-emerald-200 bg-emerald-50 px-6 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-100"
            >
              Save
            </button>
          </div>
        </div>

        {/* Right: avatar */}
        <div className="flex flex-col items-center justify-start flex-1">
          <div className="relative h-64 w-64 rounded-full overflow-hidden border border-slate-200">
            <img
              src={value.avatarUrl}
              alt={value.name}
              className="h-full w-full object-cover"
            />

            {/* overlay Change */}
            <label className="absolute bottom-0 left-0 right-0 flex cursor-pointer items-center justify-center bg-black/40 py-2 text-xs text-white gap-1">
              <span>Change avatar</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-32 text-right text-sm text-slate-700 pr-2">
        {label}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
