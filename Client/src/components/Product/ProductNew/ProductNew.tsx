// src/components/Product/ProductNew/ProductNew.tsx
import { useState, useEffect, useRef } from "react";
import { Image } from "lucide-react";
import useCategories from "../../../hooks/useCategories";

export type NewProductForm = {
  name: string;
  category: string;
  material: string;
  weight: string;
  gemstone: string;
  size: string;
  caratWeight: string;
  color: string;
  shape: string;
  purity: string;
  gemstoneSize: string;
  certificate: string;
  description: string;
  price: string;
  discount: string;
  imageUrl: string;
  imageFiles: File[];
};

type ProductNewProps = {
  onCancel?: () => void;
  onSave?: (data: NewProductForm) => void;
  saving?: boolean;
};

export default function ProductNew({ onCancel, onSave, saving = false }: ProductNewProps) {
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const { categories, loading: categoryLoading, error: categoryError } = useCategories();
  const [form, setForm] = useState<NewProductForm>({
    name: "",
    category: "",
    material: "",
    weight: "",
    gemstone: "",
    size: "",
    caratWeight: "",
    color: "",
    shape: "",
    purity: "",
    gemstoneSize: "",
    certificate: "",
    description: "",
    price: "",
    discount: "",
    imageUrl: "",
    imageFiles: []
  });
  const [images, setImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");

  const handleChange =
    (field: keyof NewProductForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleAddImage = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages((prev) => [...prev, url]);
    if (images.length === 0) {
      setMainImage(url);
    }
    setForm((prev) => ({
      ...prev,
      imageUrl: url,
      imageFiles: [...prev.imageFiles, file]
    }));
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== idx);
      if (mainImage === prev[idx]) {
        setMainImage(newImages[0] || "");
      }
      return newImages;
    });
    setForm((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== idx)
    }));
  };

  // Auto-resize description field to fit content
  useEffect(() => {
    const el = descriptionRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [form.description]);

  const handleSaveClick = () => {
    onSave?.(form);
  };

  const inputClass =
    "w-full rounded border border-slate-300 px-3 py-1.5 text-xs outline-none " +
    "focus:border-[#1279C3] focus:ring-1 focus:ring-[#1279C3]/30";

  const smallInputClass =
    "w-24 rounded border border-slate-300 px-3 py-1.5 text-xs outline-none " +
    "focus:border-[#1279C3] focus:ring-1 focus:ring-[#1279C3]/30";

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm">
      {/* 3 columns: thumbnails - main image - form */}
      <div className="flex items-start gap-10">
        {/* LEFT: thumbnails + Add */}
        <div className="flex flex-col gap-4 pt-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative h-32 w-32 rounded-md overflow-hidden border border-slate-300 bg-white cursor-pointer"
            >
              <img
                src={img}
                alt={`Preview ${idx}`}
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

          <label className="h-32 w-32 rounded-md border border-dashed border-slate-300 flex flex-col items-center justify-center text-xs text-slate-500 cursor-pointer bg-white">
            <Image className="w-6 h-6" />
            <span>Add</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleAddImage(e.target.files?.[0])}
            />
          </label>
        </div>

        {/* CENTER: main image */}
        <div className="flex-1 flex justify-center pt-2">
          <div className="h-[420px] w-[420px] rounded-md overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-50">
            {mainImage ? (
              <img src={mainImage} alt="Main preview" className="h-full w-full object-cover" />
            ) : (
              <div className="text-slate-400 text-sm">No image selected</div>
            )}
          </div>
        </div>

        {/* RIGHT: form */}
        <div className="flex-1 flex justify-center pt-2">
          <div className="w-full max-w-[520px] text-xs">
            <div className="space-y-3">
              <InfoRow label="Product name">
                <input className={inputClass} value={form.name} onChange={handleChange("name")} />
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
                      value={form.category}
                      onChange={handleChange("category")}
                    >
                      <option value="">Choose category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">
                      ▼
                    </span>
                  </div>
                  {categoryLoading && (
                    <div className="text-[11px] text-slate-500">Loading categories...</div>
                  )}
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
                <input className={inputClass} value={form.price} onChange={handleChange("price")} />
              </InfoRow>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="min-w-[120px] rounded-md border border-red-200 bg-red-50 px-6 py-2 text-sm font-medium text-red-500 hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveClick}
                disabled={saving}
                className="min-w-[120px] rounded-md border border-emerald-200 bg-emerald-50 px-6 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed"
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

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className="w-28 text-left text-xs text-slate-700">{label}:</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
