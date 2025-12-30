import { useState } from "react";
import { SupplierService } from "../services";
import type { SupplierRow } from "../components/Supplier/SupplierTable/SupplierTable";

interface EditingSupplier {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export default function useSupplierEdit(onSuccess?: () => Promise<void>) {
  const [editingSupplier, setEditingSupplier] = useState<EditingSupplier | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditSupplier = (supplier: SupplierRow) => {
    setEditingSupplier({ ...supplier });
    setError(null);
  };

  const handleEditChange = (field: keyof Omit<EditingSupplier, "id">, value: string) => {
    setEditingSupplier((prev) => (prev ? { ...prev, [field]: value } : null));
    setError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingSupplier) return;
    if (!editingSupplier.name.trim()) {
      setError("Supplier name is required");
      return;
    }
    if (!editingSupplier.address.trim()) {
      setError("Address is required");
      return;
    }
    if (!editingSupplier.phone.trim()) {
      setError("Phone is required");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await SupplierService.updateSupplier(editingSupplier.id, {
        name: editingSupplier.name.trim(),
        address: editingSupplier.address.trim(),
        phone: editingSupplier.phone.trim()
      });
      setEditingSupplier(null);
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update supplier");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingSupplier(null);
    setError(null);
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) {
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await SupplierService.deleteSupplier(supplierId);
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete supplier");
    } finally {
      setLoading(false);
    }
  };

  return {
    editingSupplier,
    loading,
    error,
    handleEditSupplier,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteSupplier
  };
}
