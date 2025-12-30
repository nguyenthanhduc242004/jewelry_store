import React, { useState } from "react";

export type Employee = {
  avatarUrl: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  birthday: string;
  position: string;
  account: string;
};

type EmployeeProfileProps = {
  employee: Employee;
  onEdit?: () => void;
  onDelete?: () => void;
  onResetPassword?: () => void;
};

export default function EmployeeProfile({
  employee,
  onEdit,
  onDelete,
  onResetPassword
}: EmployeeProfileProps) {
  const { avatarUrl, name, address, phone, email, birthday, position, account } = employee;
  const [resetStatus, setResetStatus] = useState<string>("");
  const [resetting, setResetting] = useState(false);

  // Format birthday as DD/MM/YYYY
  function formatBirthday(dateStr: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB");
  }

  async function handleResetPassword() {
    if (!onResetPassword) return;
    const confirmed = window.confirm(
      "Are you sure you want to reset this account's password to '12345678'?"
    );
    if (!confirmed) return;
    setResetting(true);
    setResetStatus("");
    try {
      await onResetPassword();
      setResetStatus("Password reset to 12345678");
    } catch (e: any) {
      setResetStatus(e?.message || "Failed to reset password");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="w-full flex justify-center mt-2">
      <div className="max-w-5xl w-full flex gap-16">
        {/* Left: form */}
        <div className="flex-1">
          <div className="space-y-3 text-sm">
            {/* Row */}
            <InfoRow label="Name:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={name}
                readOnly
              />
            </InfoRow>

            <InfoRow label="Address:">
              <textarea
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500 resize-y min-h-[40px] max-h-40"
                value={address}
                readOnly
                rows={2}
                style={{ overflowWrap: "break-word" }}
              />
            </InfoRow>

            <InfoRow label="Phone number:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={phone}
                readOnly
              />
            </InfoRow>

            <InfoRow label="Email:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={email}
                readOnly
              />
            </InfoRow>

            <InfoRow label="Birthday:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={formatBirthday(birthday)}
                readOnly
              />
            </InfoRow>

            <InfoRow label="Position:">
              <input
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                value={position}
                readOnly
              />
            </InfoRow>

            {/* Account + reset password inline */}
            <InfoRow label="Account:">
              <div className="flex gap-3 items-center">
                <input
                  className="flex-1 rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
                  value={account}
                  readOnly
                />
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="whitespace-nowrap rounded border border-sky-500 px-3 py-1 text-xs text-sky-600 hover:bg-sky-50 disabled:opacity-60"
                  disabled={resetting}
                >
                  {resetting ? "Resetting..." : "Reset password"}
                </button>
              </div>
            </InfoRow>
            {resetStatus && <div className="text-xs text-green-600 pl-36 pt-1">{resetStatus}</div>}
          </div>

          {/* Buttons removed for view-only mode */}
        </div>

        {/* Right: avatar */}
        <div className="flex items-start justify-center flex-1">
          <div className="h-64 w-64 rounded-full overflow-hidden border border-slate-200">
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Row helper component cho phần label + input */
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-32 text-right text-sm text-slate-700 pr-2">{label}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
