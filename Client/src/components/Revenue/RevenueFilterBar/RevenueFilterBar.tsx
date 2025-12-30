import { useEffect, useRef, useState } from "react";
import DateRangePopup from "../../common/DateRangePopup/DateRangePopup";
export default function ReportFilterBar() {
  
  const [isDateOpen, setIsDateOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);

  // Click ra ngoài thì đóng popup
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(e.target as Node)
      ) {
        setIsDateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Report + nút filter + popup date-range */}
        <div className="flex items-center gap-3" ref={filterRef}>
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">
            Revenue
          </h2>

          {/* nút 3 gạch */}
          <button
            type="button"
            onClick={() => setIsDateOpen((prev) => !prev)}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 text-xs hover:bg-slate-50 transition"
          >
            ☰
          </button>

          {/* Popup date-range */}
          <DateRangePopup isOpen={isDateOpen} />
        </div>

        
          {/* Export button */}
          <button className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition">
            Export
          </button>
        </div>
      </div>
  );
}
