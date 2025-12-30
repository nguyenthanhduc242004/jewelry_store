type DatePriceFilterPopupProps = {
  isOpen: boolean;
  className?: string;
  fromDate: string;
  toDate: string;
  minPrice: number;
  maxPrice: number;
  maxLimit: number;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onApply: () => void;
};

const formatPrice = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 0 });

export default function DatePriceFilterPopup({
  isOpen,
  className,
  fromDate,
  toDate,
  minPrice,
  maxPrice,
  maxLimit,
  onFromDateChange,
  onToDateChange,
  onMinPriceChange,
  onMaxPriceChange,
  onApply
}: DatePriceFilterPopupProps) {
  if (!isOpen) return null;

  const MIN_PRICE = 0;

  // Calculate bubble position as percentage
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
        {/* From Date */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">From Date</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-blue-500"
          />
        </div>

        {/* To Date */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">To Date</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-blue-500"
          />
        </div>

        {/* Min Price */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">Min Price</span>

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
                onMinPriceChange(Math.min(value, maxPrice));
              }}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="mt-1 flex justify-between text-[11px] text-slate-500">
            <span>{formatPrice(MIN_PRICE)}</span>
            <span>{formatPrice(maxLimit)}</span>
          </div>
        </div>

        {/* Max Price */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500">Max Price</span>

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
                onMaxPriceChange(Math.max(value, minPrice));
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
