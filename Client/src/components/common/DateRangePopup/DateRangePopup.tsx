type DateRangePopupProps = {
  isOpen: boolean;
};

export default function DateRangePopup({ isOpen }: DateRangePopupProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute z-20 mt-10 rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-lg">
      <div className="flex flex-col gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">From</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                defaultValue="2024-09-01"
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="h-10 w-px bg-slate-200" />

          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500">To</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                defaultValue="2024-09-07"
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
