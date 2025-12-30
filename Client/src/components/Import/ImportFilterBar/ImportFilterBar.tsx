import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePriceFilterPopup from "../../common/DatePriceFilterPopup/DatePriceFilterPopup";

type ImportFilterBarProps = {
  onFilterChange: (filters: {
    fromDate: string;
    toDate: string;
    minPrice: number;
    maxPrice: number;
  }) => void;
  maxLimit: number;
  onExport: () => void;
};

export default function ImportFilterBar({
  onFilterChange,
  maxLimit,
  onExport
}: ImportFilterBarProps) {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);

  // Filter states
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(maxLimit);

  // Update filterMaxPrice when maxLimit changes
  useEffect(() => {
    setFilterMaxPrice(maxLimit);
  }, [maxLimit]);

  // Click ra ngoài thì đóng popup
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsDateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate("/manager/import/new");
  };

  const handleApplyFilter = () => {
    onFilterChange({
      fromDate: filterFromDate,
      toDate: filterToDate,
      minPrice: filterMinPrice,
      maxPrice: filterMaxPrice
    });
    setIsDateOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3" ref={filterRef}>
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Import</h2>

          <button
            type="button"
            onClick={() => setIsDateOpen((prev) => !prev)}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 text-xs hover:bg-slate-50 transition"
          >
            ☰
          </button>

          {/* Popup date-range */}
          <DatePriceFilterPopup
            isOpen={isDateOpen}
            className="top-1 left-20"
            fromDate={filterFromDate}
            toDate={filterToDate}
            minPrice={filterMinPrice}
            maxPrice={filterMaxPrice}
            maxLimit={maxLimit}
            onFromDateChange={setFilterFromDate}
            onToDateChange={setFilterToDate}
            onMinPriceChange={setFilterMinPrice}
            onMaxPriceChange={setFilterMaxPrice}
            onApply={handleApplyFilter}
          />
        </div>

        {/* Export button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
            onClick={handleAddNew}
          >
            Add new import
          </button>
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
