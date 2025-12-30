import type { ProductGemstone } from "../../../services";
import GemstoneForm from "../GemstoneForm/GemstoneForm";

interface GemstoneFormData {
  name: string;
  weight: string;
  size: string;
  color: string;
}

type GemstoneTableProps = {
  gemstones: ProductGemstone[];
  isAddingGemstone: boolean;
  newGemstone: GemstoneFormData;
  editingGemstone: (GemstoneFormData & { id: number }) | null;
  editLoading: boolean;
  editError: string | null;
  loading: boolean;
  error: string | null;
  onAddClick: () => void;
  onFormChange: (field: keyof GemstoneFormData, value: string) => void;
  onFormSave: () => void;
  onFormCancel: () => void;
  onEditClick: (gem: ProductGemstone) => void;
  onEditChange: (field: keyof Omit<GemstoneFormData, "id">, value: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDeleteClick: (gemstoneId: number) => void;
};

export default function GemstoneTable({
  gemstones,
  isAddingGemstone,
  newGemstone,
  editingGemstone,
  editLoading,
  editError,
  loading,
  error,
  onAddClick,
  onFormChange,
  onFormSave,
  onFormCancel,
  onEditClick,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDeleteClick
}: GemstoneTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1279C3]">Gemstone details</h3>
        <button
          type="button"
          onClick={onAddClick}
          disabled={isAddingGemstone || editingGemstone !== null}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add new gemstone
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-[#1279C3] text-white text-[12px] uppercase tracking-wide">
              <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">Name</th>
              <th className="px-4 py-3 font-medium text-center align-middle">Weight (g)</th>
              <th className="px-4 py-3 font-medium text-center align-middle">Size</th>
              <th className="px-4 py-3 font-medium text-center align-middle">Color</th>
              <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isAddingGemstone && (
              <GemstoneForm
                gemstone={newGemstone}
                loading={loading}
                error={error}
                onChange={onFormChange}
                onSave={onFormSave}
                onCancel={onFormCancel}
              />
            )}
            {editingGemstone && (
              <GemstoneForm
                gemstone={editingGemstone}
                loading={editLoading}
                error={editError}
                isEdit={true}
                onChange={onEditChange}
                onSave={onEditSave}
                onCancel={onEditCancel}
              />
            )}
            {gemstones
              .filter((gem) => !editingGemstone || gem.id !== editingGemstone.id)
              .map((gem) => (
                <tr key={gem.id} className="even:bg-slate-50">
                  <td className="px-4 py-3 text-center align-middle text-slate-700">{gem.name}</td>
                  <td className="px-4 py-3 text-center align-middle text-slate-700">
                    {gem.weight.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center align-middle text-slate-700">
                    {gem.size ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-center align-middle text-slate-700">
                    {gem.color ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-center align-middle">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEditClick(gem)}
                        disabled={isAddingGemstone || editingGemstone !== null}
                        className="rounded-md border border-[#DDE4F0] px-3 py-1 text-xs font-medium text-[#1279C3] hover:bg-[#1279C3]/5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteClick(gem.id)}
                        disabled={isAddingGemstone || editingGemstone !== null || editLoading}
                        className="rounded-md border border-[#FACDC3] px-3 py-1 text-xs font-medium text-[#EB2F06] hover:bg-[#FACDC3]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
