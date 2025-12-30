import { useState } from "react";
import { GemstoneService } from "../services";
import type { ProductGemstone } from "../services";

interface EditingGemstone {
  id: number;
  name: string;
  weight: string;
  size: string;
  color: string;
}

export default function useGemstoneEdit(onSuccess?: () => Promise<void>) {
  const [editingGemstone, setEditingGemstone] = useState<EditingGemstone | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditGemstone = (gemstone: ProductGemstone) => {
    setEditingGemstone({
      id: gemstone.id,
      name: gemstone.name,
      weight: gemstone.weight.toString(),
      size: gemstone.size || "",
      color: gemstone.color || ""
    });
    setError(null);
  };

  const handleEditChange = (field: keyof Omit<EditingGemstone, "id">, value: string) => {
    setEditingGemstone((prev) => (prev ? { ...prev, [field]: value } : null));
    setError(null);
  };

  const handleSaveEdit = async (productId: number) => {
    if (!editingGemstone) return;

    if (!editingGemstone.name.trim()) {
      setError("Gemstone name is required");
      return;
    }

    if (!editingGemstone.weight.trim()) {
      setError("Weight is required");
      return;
    }

    const weight = parseFloat(editingGemstone.weight);
    if (isNaN(weight) || weight <= 0) {
      setError("Weight must be a positive number");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await GemstoneService.updateGemstone(editingGemstone.id, {
        productId,
        name: editingGemstone.name.trim(),
        weight,
        size: editingGemstone.size.trim() || undefined,
        color: editingGemstone.color.trim() || undefined
      });

      setEditingGemstone(null);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update gemstone");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingGemstone(null);
    setError(null);
  };

  const handleDeleteGemstone = async (gemstoneId: number) => {
    if (!window.confirm("Are you sure you want to delete this gemstone?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await GemstoneService.deleteGemstone(gemstoneId);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete gemstone");
    } finally {
      setLoading(false);
    }
  };

  return {
    editingGemstone,
    loading,
    error,
    handleEditGemstone,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteGemstone
  };
}
