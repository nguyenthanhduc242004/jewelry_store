import { useEffect, useState } from "react";
import { CategoryService, type CategoryDto } from "../../../services/category.service";

type PriceFilterPopupProps = {
  isOpen: boolean;
  className?: string;
  minPrice: number;
  maxPrice: number;
  maxLimit: number;
  category: string;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onCategoryChange: (value: string) => void;
  onApply: () => void;
};

const formatPrice = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 0 });

export default function PriceFilterPopup({
  isOpen,
  className,
  minPrice,
  maxPrice,
  maxLimit,
  category,
  onMinPriceChange,
  onMaxPriceChange,
  onCategoryChange,
  onApply
}: PriceFilterPopupProps) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const data = await CategoryService.fetchCategories({ signal: controller.signal });
        setCategories(data);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        console.error("Failed to load categories:", err);
      }
    })();
    return () => controller.abort();
  }, []);

  if (!isOpen) return null;

  const MIN_PRICE = 0;

  // tính vị trí bubble theo %
  const minPosition = ((minPrice - MIN_PRICE) / (maxLimit - MIN_PRICE)) * 100 || 0;
  const maxPosition = ((maxPrice - MIN_PRICE) / (maxLimit - MIN_PRICE)) * 100 || 0;

  return (
    <div
      className={
        "absolute z-20 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-xs shadow-lg " +
        (className ?? "")
      }
    >
      <div className="flex w-72 flex-col gap-3 text-slate-700">
        {/* Category */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Category</span>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-32 rounded-full border border-slate-300 px-3 py-1 text-xs outline-none focus:border-blue-500"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Min price */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">Min price</span>

          <div className="relative mt-2">
            {/* bubble */}
            <div
              className="pointer-events-none absolute -top-6 flex -translate-x-1/2 items-center justify-center rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ left: `${minPosition}%` }}
            >
              {formatPrice(minPrice)}
            </div>

            <input
              type="range"
              min={MIN_PRICE}
              max={maxLimit}
              step={100_000}
              value={minPrice}
              onChange={(e) => {
                const value = Number(e.target.value);
                onMinPriceChange(Math.min(value, maxPrice)); // không vượt quá max
              }}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="mt-1 flex justify-between text-[11px] text-slate-500">
            <span>{formatPrice(MIN_PRICE)}</span>
            <span>{formatPrice(maxLimit)}</span>
          </div>
        </div>

        {/* Max price */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">Max price</span>

          <div className="relative mt-2">
            {/* bubble */}
            <div
              className="pointer-events-none absolute -top-6 flex -translate-x-1/2 items-center justify-center rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ left: `${maxPosition}%` }}
            >
              {formatPrice(maxPrice)}
            </div>

            <input
              type="range"
              min={MIN_PRICE}
              max={maxLimit}
              step={100_000}
              value={maxPrice}
              onChange={(e) => {
                const value = Number(e.target.value);
                onMaxPriceChange(Math.max(value, minPrice)); // không nhỏ hơn min
              }}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="mt-1 flex justify-between text-[11px] text-slate-500">
            <span>{formatPrice(MIN_PRICE)}</span>
            <span>{formatPrice(maxLimit)}</span>
          </div>
        </div>

        {/* Apply button */}
        <button
          onClick={onApply}
          className="mt-2 w-full rounded-lg bg-blue-500 py-2 text-xs font-medium text-white hover:bg-blue-600 transition"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
}
