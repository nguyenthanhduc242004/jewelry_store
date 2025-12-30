import { useState, useCallback } from "react";
import { ProductService, InventoryService, ProductImageService, type UpdateProductDto } from "../services";

export type SaveProductInput = {
  name: string;
  material: string;
  description: string;
  price: string;
  quantity: string;
  categoryId?: string;
  images?: string[];
};

const parseNumber = (value: string): number => {
  const trimmed = value.trim();
  const hasComma = trimmed.includes(",");
  const hasDot = trimmed.includes(".");

  if (hasComma && !hasDot) {
    return Number(trimmed.replace(",", "."));
  }

  const normalized = trimmed.replace(/,/g, "");
  return Number(normalized);
};

export default function useUpdateProduct(
  productId?: string | number,
  fallbackCategoryId?: number,
  initialImages: string[] = [],
) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    async (data: SaveProductInput): Promise<boolean> => {
      const targetId = Number(productId);
      if (Number.isNaN(targetId)) {
        setError("Invalid product ID");
        return false;
      }

      try {
        setSaving(true);
        setError(null);

        const priceNumber = parseNumber(data.price);
        const quantityNumber = parseNumber(data.quantity);

        if (Number.isNaN(priceNumber) || Number.isNaN(quantityNumber)) {
          setError("Please enter valid numeric values for price and quantity.");
          setSaving(false);
          return false;
        }

        const payload: UpdateProductDto = {
          name: data.name,
          material: data.material,
          description: data.description,
          price: priceNumber,
          quantity: quantityNumber,
          categoryId: data.categoryId ? Number(data.categoryId) : fallbackCategoryId,
        };

        await ProductService.updateProduct(targetId, payload);
        await InventoryService.updateInventory(targetId, {
          productId: targetId,
          quantity: quantityNumber,
        });

        if (data.images) {
          const newImages = data.images;
          const unchanged =
            initialImages.length === newImages.length &&
            initialImages.every((img, idx) => img === newImages[idx]);

          if (!unchanged) {
            // Delete all existing images (by order) then recreate with new order
            for (let i = 0; i < initialImages.length; i += 1) {
              await ProductImageService.deleteProductImage(targetId, i + 1);
            }
            for (let i = 0; i < newImages.length; i += 1) {
              await ProductImageService.createProductImage(targetId, {
                imageOrder: i + 1,
                imageUrl: newImages[i],
              });
            }
          }
        }

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save product");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [productId, fallbackCategoryId, initialImages],
  );

  return { save, saving, error };
}
