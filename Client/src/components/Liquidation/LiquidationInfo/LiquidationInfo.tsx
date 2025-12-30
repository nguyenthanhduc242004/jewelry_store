
export type LiquidationInfoProps = {
  id: string;
  creator: string;
  inspector: string;
  dateCreated: string;
  state: string;
};

export default function LiquidationInfo({
  id,
  creator,
  inspector,
  dateCreated,
  state,
}: LiquidationInfoProps) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
      {/* Cột trái */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-24 text-xs text-slate-500">ID:</span>
          <input
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-xs"
            value={id}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-24 text-xs text-slate-500">Creator:</span>
          <input
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-xs"
            value={creator}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-24 text-xs text-slate-500">Inspector:</span>
          <input
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-xs"
            value={inspector}
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
