import { useMemo, useRef, useState } from "react";
import SupplierTable from "../../../../components/Supplier/SupplierTable/SupplierTable";
import { useSuppliers } from "../../../../hooks/useSuppliers";
import useSupplierForm from "../../../../hooks/useSupplierForm";
import useSupplierEdit from "../../../../hooks/useSupplierEdit";
import { exportToPDF } from "../../../../utils/pdfExport";

export default function Supplier() {
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Custom hook for fetching suppliers
  const { rows, error, loading: fetchLoading, refetch } = useSuppliers(0, 100);

  // Custom hook for adding new supplier
  const {
    isAddingSupplier,
    newSupplier,
    loading: addLoading,
    error: addError,
    handleAddSupplier,
    handleSupplierChange,
    handleSaveSupplier,
    handleCancelAddSupplier
  } = useSupplierForm(async () => {
    // Refetch suppliers after successful add
    refetch();
  });

  // Custom hook for editing/deleting supplier
  const {
    editingSupplier,
    loading: editLoading,
    error: editError,
    handleEditSupplier,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteSupplier
  } = useSupplierEdit(async () => {
    // Refetch suppliers after successful edit/delete
    refetch();
  });

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      [(row as any).name, (row as any).address, (row as any).phone]
        .filter(Boolean)
        .some((value) => value!.toString().toLowerCase().includes(term))
    );
  }, [rows, searchTerm]);

  // Handler to extract numeric ID from formatted ID (e.g., "SUP001" -> "1")
  const handleEdit = (row: any) => {
    const numericId = row.id.replace(/\D/g, ""); // Extract numeric part
    handleEditSupplier({ ...row, id: numericId });
  };

  const handleDelete = (formattedId: string) => {
    const numericId = formattedId.replace(/\D/g, ""); // Extract numeric part
    handleDeleteSupplier(numericId);
  };

  const handleExport = async () => {
    await exportToPDF({
      title: "Supplier List",
      columns: [
        { header: "ID", dataKey: "id", width: 25 },
        { header: "Name", dataKey: "name", width: 60 },
        { header: "Address", dataKey: "address", width: 70 },
        { header: "Phone", dataKey: "phone", width: 35 }
      ],
      data: filteredRows,
      filename: `suppliers-${Date.now()}.pdf`,
      orientation: "portrait"
    });
  };

  return (
    <div className="space-y-5 mt-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 relative" ref={filterRef}>
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Supplier</h2>
        </div>
        <div className="flex-1 min-w-[240px] max-w-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, address, or phone"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="justify-end flex gap-3">
          <button
            type="button"
            onClick={handleAddSupplier}
            disabled={isAddingSupplier || editingSupplier !== null}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add new supplier
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
          >
            Export
          </button>
        </div>
      </div>
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        {error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <SupplierTable
            rows={filteredRows}
            isAddingSupplier={isAddingSupplier}
            newSupplier={newSupplier}
            editingSupplier={editingSupplier}
            addLoading={addLoading}
            addError={addError}
            editLoading={editLoading}
            editError={editError}
            onAddClick={handleAddSupplier}
            onFormChange={handleSupplierChange}
            onFormSave={handleSaveSupplier}
            onFormCancel={handleCancelAddSupplier}
            onEdit={handleEdit}
            onEditChange={handleEditChange}
            onEditSave={handleSaveEdit}
            onEditCancel={handleCancelEdit}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
}
