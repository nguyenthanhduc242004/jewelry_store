interface GemstoneFormData {
  name: string;
  weight: string;
  size: string;
  color: string;
}

type GemstoneFormProps = {
  gemstone: GemstoneFormData;
  loading: boolean;
  error: string | null;
  isEdit?: boolean;
  onChange: (field: keyof GemstoneFormData, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function GemstoneForm({
  gemstone,
  loading,
  error,
  isEdit = false,
  onChange,
  onSave,
  onCancel
}: GemstoneFormProps) {
  return (
    <tr className={isEdit ? "bg-yellow-50" : "bg-blue-50"}>
      <td className="px-4 py-3 text-center align-middle">
        <input
          type="text"
          placeholder="Name"
          value={gemstone.name}
          onChange={(e) => onChange("name", e.target.value)}
          disabled={loading}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
        />
      </td>
      <td className="px-4 py-3 text-center align-middle">
        <input
          type="text"
          placeholder="Weight"
          value={gemstone.weight}
          onChange={(e) => onChange("weight", e.target.value)}
          disabled={loading}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
        />
      </td>
      <td className="px-4 py-3 text-center align-middle">
        <input
          type="text"
          placeholder="Size"
          value={gemstone.size}
          onChange={(e) => onChange("size", e.target.value)}
          disabled={loading}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
        />
      </td>
      <td className="px-4 py-3 text-center align-middle">
        <input
          type="text"
          placeholder="Color"
          value={gemstone.color}
          onChange={(e) => onChange("color", e.target.value)}
          disabled={loading}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
        />
      </td>
      <td className="px-4 py-3 text-center align-middle">
        <div className="flex flex-col gap-2">
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={loading}
              className="rounded-md border border-green-300 px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isEdit ? "Updating..." : "Saving...") : isEdit ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
          {error && <div className="text-xs text-red-600 text-center">{error}</div>}
        </div>
      </td>
    </tr>
  );
}
