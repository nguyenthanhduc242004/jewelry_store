export type CustomerInfoProps = {
  id: string;
  customer: string;
  date: string;
  seller: string;
};

type CustomerInfoComponentProps = {
  bill: CustomerInfoProps;
};

export default function CustomerInfo({
  bill,
}: CustomerInfoComponentProps) {
  const { id, customer, date, seller } =
    bill;

  return (
    <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
      {/* Cột trái */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-24 text-xs text-slate-500">ID:</span>
          <input
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-xs"
            value={id}
            readOnly
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-24 text-xs text-slate-500">Customer:</span>
          <input
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-xs"
            value={customer}
            readOnly
          />
        </div>
      </div>

      {/* Cột phải */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-28 text-xs text-slate-500">Date:</span>
          <input
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-xs"
            value={date}
            readOnly
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-28 text-xs text-slate-500">
            Seller:
          </span>
          <input
            className="h-8 flex-1 rounded border border-slate-300 px-2 text-xs"
            value={seller}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
