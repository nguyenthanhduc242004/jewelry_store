import { useState } from "react";
import { SupplierService } from "../services";

interface NewSupplier {
  name: string;
  address: string;
  phone: string;
}

export default function useSupplierForm(onSuccess?: () => Promise<void>) {
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [newSupplier, setNewSupplier] = useState<NewSupplier>({
    name: "",
    address: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSupplier = () => {
    setIsAddingSupplier(true);
    setError(null);
  };

  const handleSupplierChange = (field: keyof NewSupplier, value: string) => {
    setNewSupplier((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSaveSupplier = async () => {
    // Validate required fields
    if (!newSupplier.name.trim()) {
      setError("Supplier name is required");
      return;
    }
    if (!newSupplier.address.trim()) {
      setError("Address is required");
      return;
    }
    if (!newSupplier.phone.trim()) {
      setError("Phone is required");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await SupplierService.createSupplier({
        name: newSupplier.name.trim(),
        address: newSupplier.address.trim(),
        phone: newSupplier.phone.trim()
      });
      setIsAddingSupplier(false);
      setNewSupplier({ name: "", address: "", phone: "" });
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save supplier");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddSupplier = () => {
    setIsAddingSupplier(false);
    setNewSupplier({ name: "", address: "", phone: "" });
    setError(null);
  };

  return {
    isAddingSupplier,
    newSupplier,
    loading,
    error,
    handleAddSupplier,
    handleSupplierChange,
    handleSaveSupplier,
    handleCancelAddSupplier
  };
}
