import { useParams } from "react-router-dom";
import { useRef } from "react";
import LiquidationInfo from "../../../../components/Liquidation/LiquidationInfo/LiquidationInfo";
import LiquidationProductTable, {
  type LiquidationProductRow
} from "../../../../components/Liquidation/LiquidationInfo/LiquidationProductTable";
import { exportToPDF } from "../../../../utils/pdfExport";
const rows: LiquidationProductRow[] = [
  {
    no: 1,
    name: "Product 1",
    subtitle: "Gold, Amethyst",
    imageUrl: "/img/image1.png",
    category: "Necklace",
    price: 10000000,
    quantity: 2,
    totalPrice: 20000000,
    currency: "VND"
  }
];

export default function LiquidationDetail() {
  const { id } = useParams<{ id: string }>();

  const filterRef = useRef<HTMLDivElement | null>(null);

  const handleExport = async () => {
    await exportToPDF({
      title: `Liquidation Details - ${id || "LIQ001"}`,
      columns: [
        { header: "No", dataKey: "no", width: 15 },
        { header: "Product", dataKey: "name", width: 50 },
        { header: "Category", dataKey: "category", width: 35 },
        { header: "Price (VND)", dataKey: "price", width: 35 },
        { header: "Quantity", dataKey: "quantity", width: 25 },
        { header: "Total (VND)", dataKey: "totalPrice", width: 35 }
      ],
      data: rows,
      filename: `liquidation-detail-${id || "unknown"}-${Date.now()}.pdf`,
      orientation: "landscape"
    });
  };

  return (
    <div className="space-y-5 mt-3">
      {/* Hàng tiêu đề + nút */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 relative" ref={filterRef}>
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">
            Liquidation Detail
          </h2>
        </div>
        <div className="justify-end">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition ml-3"
          >
            Export
          </button>
        </div>
      </div>
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <LiquidationInfo
          id={id ?? "LIQ001"}
          creator="Employee3"
          inspector=""
          dateCreated="02/09/2024"
          state="Waiting"
        />

        <LiquidationProductTable rows={rows} />
      </section>
    </div>
  );
}
