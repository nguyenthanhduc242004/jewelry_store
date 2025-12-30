export type ImportInfoProps = {
  lot: string;
  supplier: string;
  staff: string;
  dateCreated: string;
  dateAccepted: string;
  state: string;
};

export default function ImportInfo({
  lot,
  supplier,
  staff,
  dateCreated,
  dateAccepted,
  state,
}: ImportInfoProps) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
      {/* Cột trái */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-24 text-xs text-slate-500">LOT:</span>
          <input
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-xs"
            value={lot}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-24 text-xs text-slate-500">Supplier:</span>
          <input
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-xs"
            value={supplier}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-24 text-xs text-slate-500">Staff:</span>
          <input
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-xs"
            value={staff}
          />
        </div>
      </div>

      {/* Cột phải */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-28 text-xs text-slate-500">Date Created:</span>
          <input
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-xs"
            value={dateCreated}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-28 text-xs text-slate-500">DateAccepted:</span>
          <input
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-xs"
            value={dateAccepted}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-28 text-xs text-slate-500">State:</span>
          <input
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-xs"
            value={state}
          />
        </div>
      </div>
    </div>
  );
}
