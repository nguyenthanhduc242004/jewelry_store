import { useState } from "react";
import { GemstoneService } from "../services";

interface NewGemstone {
  name: string;
  weight: string;
  size: string;
  color: string;
}

export default function useGemstoneForm(productId?: number, onSuccess?: () => Promise<void>) {
  const [isAddingGemstone, setIsAddingGemstone] = useState(false);
  const [newGemstone, setNewGemstone] = useState<NewGemstone>({
    name: "",
    weight: "",
    size: "",
    color: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddGemstone = () => {
    setIsAddingGemstone(true);
    setError(null);
  };

  const handleGemstoneChange = (field: keyof NewGemstone, value: string) => {
    setNewGemstone((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSaveGemstone = async () => {
    if (!productId) {
      setError("Product ID is missing");
      return;
    }

    // Validate required fields
    if (!newGemstone.name.trim()) {
      setError("Gemstone name is required");
      return;
    }

    if (!newGemstone.weight.trim()) {
      setError("Weight is required");
      return;
    }

    const weight = parseFloat(newGemstone.weight);
    if (isNaN(weight) || weight <= 0) {
      setError("Weight must be a positive number");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await GemstoneService.createGemstone({
        productId,
        name: newGemstone.name.trim(),
        weight,
        size: newGemstone.size.trim() || undefined,
        color: newGemstone.color.trim() || undefined
      });

      setIsAddingGemstone(false);
      setNewGemstone({ name: "", weight: "", size: "", color: "" });

      // Call the onSuccess callback to refetch the product details
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save gemstone");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddGemstone = () => {
    setIsAddingGemstone(false);
    setNewGemstone({ name: "", weight: "", size: "", color: "" });
    setError(null);
  };

  return {
    isAddingGemstone,
    newGemstone,
    loading,
    error,
    handleAddGemstone,
    handleGemstoneChange,
    handleSaveGemstone,
    handleCancelAddGemstone
  };
}
