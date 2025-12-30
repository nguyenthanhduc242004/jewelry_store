import { displayOrDash } from "../../../utils/display";
import SupplierForm from "./SupplierForm";

export type SupplierRow = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

interface NewSupplier {
  name: string;
  address: string;
  phone: string;
}

interface EditingSupplier {
  id: string;
  name: string;
  address: string;
  phone: string;
}

type SupplierTableProps = {
  rows: SupplierRow[];
  isAddingSupplier: boolean;
  newSupplier: NewSupplier;
  editingSupplier: EditingSupplier | null;
  addLoading: boolean;
  addError: string | null;
  editLoading: boolean;
  editError: string | null;
  onAddClick: () => void;
  onFormChange: (field: keyof NewSupplier, value: string) => void;
  onFormSave: () => void;
  onFormCancel: () => void;
  onEdit: (row: SupplierRow) => void;
  onEditChange: (field: keyof Omit<EditingSupplier, "id">, value: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDelete: (id: string) => void;
};

export default function SupplierTable({
  rows,
  isAddingSupplier,
  newSupplier,
  editingSupplier,
  addLoading,
  addError,
  editLoading,
  editError,
  onAddClick,
  onFormChange,
  onFormSave,
  onFormCancel,
  onEdit,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete
}: SupplierTableProps) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-center">
          <thead>
            <tr className="bg-[#1279C3] text-white">
              <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">ID</th>
              <th className="px-4 py-3 font-medium text-center align-middle">Name</th>
              <th className="px-4 py-3 font-medium text-center align-middle">Address</th>
              <th className="px-4 py-3 font-medium text-center align-middle">Phone</th>
              <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isAddingSupplier && (
              <SupplierForm
                supplier={newSupplier}
                loading={addLoading}
                error={addError}
                onChange={onFormChange}
                onSave={onFormSave}
                onCancel={onFormCancel}
              />
            )}
            {editingSupplier && (
              <SupplierForm
                supplier={editingSupplier}
                loading={editLoading}
                error={editError}
                isEdit={true}
                onChange={onEditChange}
                onSave={onEditSave}
                onCancel={onEditCancel}
              />
            )}
            {rows
              .filter((row) => !editingSupplier || row.id !== editingSupplier.id)
              .map((row, index) => {
                const bg =
                  index % 2 === 0
                    ? "bg-slate-50/60 border-b border-slate-100"
                    : "border-b border-slate-100";
                return (
                  <tr
                    key={row.id}
                    className={`${bg} text-center cursor-pointer hover:bg-blue-50 transition`}
                  >
                    <td className="px-4 py-3 text-xs font-semibold text-slate-700 text-center align-middle">
                      {row.id}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700">{displayOrDash(row.name)}</td>
                    <td className="px-4 py-3 text-xs text-slate-700">
                      {displayOrDash(row.address)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700">{displayOrDash(row.phone)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="rounded-md border border-[#DDE4F0] px-4 py-1 text-xs font-medium text-[#1279C3] hover:bg-[#1279C3]/5 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => onEdit(row)}
                          disabled={isAddingSupplier || editingSupplier !== null}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-md border border-[#FACDC3] px-4 py-1 text-xs font-medium text-[#EB2F06] hover:bg-[#1279C3]/5 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => onDelete(row.id)}
                          disabled={isAddingSupplier || editingSupplier !== null}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
