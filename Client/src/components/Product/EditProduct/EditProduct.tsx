// src/components/Product/EditProduct/EditProduct.tsx
import React, { useEffect, useRef, useState } from "react";
import useCategories from "../../../hooks/useCategories";
import useProductImagesManager from "../../../hooks/useProductImagesManager";
import type { ProductDetail, CategoryDto } from "../../../services";
import type { ProductRow } from "../ProductTable/ProductTable";
import { Image } from "lucide-react";
import InfoRow from "../../common/InfoRow/InfoRow";

export type ProductForm = {
  name: string;
  category: string;
  categoryId?: string;
  material: string;
  description: string;
  price: string;
  quantity: string;
  mainImage: string;
  images: string[];
};

type EditProductProps = {
  product: ProductRow;
  detail?: ProductDetail | null;
  images?: string[];
  saving?: boolean;
  onCancel?: () => void;
  onSave?: (data: ProductForm) => void;
};

export default function EditProduct({
  product,
  detail,
  images,
  saving = false,
  onCancel,
  onSave,
}: EditProductProps) {
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const { categories, loading: categoryLoading, error: categoryError } = useCategories();
  const [form, setForm] = useState<ProductForm>(() => {
    const gallery = images && images.length > 0 ? images : [product.imageUrl];
    return {
      name: product.name,
      category: detail?.categoryName ?? product.category,
      categoryId: detail?.categoryId ? String(detail.categoryId) : undefined,
      material: detail?.material ?? "18K Yellow Gold",
      description: detail?.description ?? "No description available.",
      price: detail?.price ? detail.price.toString() : product.price.toString(),
      quantity: detail?.quantity?.toString() ?? product.quantity.toString(),
      mainImage: gallery[0],
      images: gallery,
    };
  });

  useEffect(() => {
    const gallery = images && images.length > 0 ? images : [product.imageUrl];
    setForm({
      name: product.name,
      category: detail?.categoryName ?? product.category,
      categoryId: detail?.categoryId ? String(detail.categoryId) : undefined,
      material: detail?.material ?? "18K Yellow Gold",
      description: detail?.description ?? "No description available.",
      price: detail?.price ? detail.price.toString() : product.price.toString(),
      quantity: detail?.quantity?.toString() ?? product.quantity.toString(),
      mainImage: gallery[0],
      images: gallery,
    });
  }, [product, detail, images]);

  const { uploading, uploadError, deleteError, handleAddImage, handleRemoveImage, setMainImage } =
    useProductImagesManager(setForm);

  const inputClass =
    "w-full rounded border border-slate-300 px-3 py-1.5 text-xs outline-none " +
    "focus:border-[#1279C3] focus:ring-1 focus:ring-[#1279C3]/30";

  const smallInputClass =
    "w-24 rounded border border-slate-300 px-3 py-1.5 text-xs outline-none " +
    "focus:border-[#1279C3] focus:ring-1 focus:ring-[#1279C3]/30";

  const handleChange =
    (field: keyof ProductForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSaveClick = () => {
    onSave?.(form);
  };

  // Auto-resize description field to fit content
  useEffect(() => {
    const el = descriptionRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [form.description]);

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm">

      {/* 3 cột: thumbnail - ảnh lớn - form */}
      <div className="flex items-start gap-10">
        {/* LEFT: thumbnails + Add */}
        <div className="flex flex-col gap-4 pt-2">
          {form.images.map((img, idx) => (
            <div
              key={idx}
              className="relative h-32 w-32 rounded-md overflow-hidden border border-slate-300 bg-white"
            >
              <img
                src={img}
                alt={`${form.name} ${idx}`}
                className="h-full w-full object-cover"
                onClick={() => setMainImage(img)}
              />
              <button
                type="button"
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-white text-xs text-red-500 border border-red-300 flex items-center justify-center"
                onClick={() => handleRemoveImage(idx)}
              >
                ✕
              </button>
            </div>
          ))}

          <label className={`h-32 w-32 rounded-md border border-dashed border-slate-300 flex flex-col items-center justify-center text-xs text-slate-500 cursor-pointer bg-white ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}>
            <Image className="w-6 h-6"/>
            <span>{uploading ? "Uploading..." : "Add"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading || saving}
              onChange={(e) => handleAddImage(e.target.files?.[0])}
            />
          </label>
          {uploadError && <div className="text-[11px] text-red-500 max-w-[9rem]">{uploadError}</div>}
          {deleteError && <div className="text-[11px] text-red-500 max-w-[9rem]">{deleteError}</div>}
        </div>

        {/* CENTER: main image */}
        <div className="flex-1 flex justify-center pt-2">
          <div className="h-[420px] w-[420px] rounded-md overflow-hidden border border-slate-200 flex items-center justify-center bg-white">
            <img
              src={form.mainImage}
              alt={form.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT: form – căn giữa, max-width ~520px */}
        <div className="flex-1 flex justify-center pt-2">
          <div className="w-full max-w-[520px] text-xs">
            <div className="space-y-3">
              <InfoRow label="Product name">
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={handleChange("name")}
                />
              </InfoRow>

              <InfoRow label="Material">
                <input
                  className={inputClass}
                  value={form.material}
                  onChange={handleChange("material")}
                />
              </InfoRow>

              <InfoRow label="Category">
                <div className="space-y-1">
                  <div className="relative">
                    <select
                      className={`${inputClass} pr-8 appearance-none`}
                      value={form.categoryId ?? ""}
                      onChange={(e) => {
                        const selected = categories.find((c) => String(c.id) === e.target.value);
                        setForm((prev) => ({
                          ...prev,
                          categoryId: e.target.value || undefined,
                          category: selected?.name ?? prev.category,
                        }));
                      }}
                    >
                      {categories.length === 0 && (
                        <option value="">{form.category || "Select category"}</option>
                      )}
                      {categories.map((cat: CategoryDto) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">
                      ▼
                    </span>
                  </div>
                  {categoryLoading && <div className="text-[11px] text-slate-500">Loading categories...</div>}
                  {categoryError && <div className="text-[11px] text-red-500">{categoryError}</div>}
                </div>
              </InfoRow>

              <InfoRow label="Description">
                <textarea
                  ref={descriptionRef}
                  rows={2}
                  className={
                    "w-full rounded border border-slate-300 px-3 py-1.5 text-xs outline-none " +
                    "focus:border-[#1279C3] focus:ring-1 focus:ring-[#1279C3]/30 resize-none overflow-hidden"
                  }
                  value={form.description}
                  onChange={handleChange("description")}
                />
              </InfoRow>

              <InfoRow label="Price">
                <input
                  className={inputClass}
                  value={form.price}
                  onChange={handleChange("price")}
                />
              </InfoRow>

              <InfoRow label="Quantity">
                <input
                  className={smallInputClass}
                  value={form.quantity}
                  onChange={handleChange("quantity")}
                />
              </InfoRow>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="min-w-[120px] rounded-md border border-red-200 bg-red-50 px-6 py-2 text-sm font-medium text-red-500 hover:bg-red-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveClick}
                disabled={saving}
                className="min-w-[120px] rounded-md border border-emerald-200 bg-emerald-50 px-6 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-100"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
