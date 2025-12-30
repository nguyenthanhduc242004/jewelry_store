import { useState } from "react";

interface SupplierFormProps {
  supplier: { name: string; address: string; phone: string };
  loading: boolean;
  error: string | null;
  isEdit?: boolean;
  onChange: (field: "name" | "address" | "phone", value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function SupplierForm({
  supplier,
  loading,
  error,
  isEdit,
  onChange,
  onSave,
  onCancel
}: SupplierFormProps) {
  return (
    <tr className="bg-white">
      <td className="px-4 py-3 text-center align-middle text-slate-700">
        {isEdit ? null : <span className="text-xs text-slate-400">(auto)</span>}
      </td>
      <td className="px-4 py-3 text-center align-middle">
        <input
          className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
          value={supplier.name}
          onChange={(e) => onChange("name", e.target.value)}
          disabled={loading}
        />
      </td>
      <td className="px-4 py-3 text-center align-middle">
        <input
          className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
          value={supplier.address}
          onChange={(e) => onChange("address", e.target.value)}
          disabled={loading}
        />
      </td>
      <td className="px-4 py-3 text-center align-middle">
        <input
          className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
          value={supplier.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          disabled={loading}
        />
      </td>
      <td className="px-4 py-3 text-center align-middle">
        <div className="flex justify-center gap-2">
          <button
            type="button"
            className="rounded-md border border-[#1279C3] px-3 py-1 text-xs font-medium text-[#1279C3] hover:bg-[#1279C3]/5 disabled:opacity-50"
            onClick={onSave}
            disabled={loading}
          >
            Save
          </button>
          <button
            type="button"
            className="rounded-md border border-[#FACDC3] px-3 py-1 text-xs font-medium text-[#EB2F06] hover:bg-[#FACDC3]/40 disabled:opacity-50"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
        {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
      </td>
    </tr>
  );
}
