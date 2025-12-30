import CostFilterBar from "../../../../components/Cost/CostFilterBar/CostFilterBar";
import CostTable, {type CostRow} from "../../../../components/Cost/CostTable/CostTable";

const CostRows: CostRow[] = [
  {
    id: "LOT1",
    content: "Import product",
    date: "07/09/2024",
    total: 100000000,
    currency: "VND",
    type: "expense",
  },
  {
    id: "B070924096523",
    content: "Sell product",
    date: "07/09/2024",
    total: 27000000,
    currency: "VND",
    type: "income",
  },
  {
    id: "B070924096524",
    content: "Sell product",
    date: "07/09/2024",
    total: 32000000,
    currency: "VND",
    type: "income",
  },
  {
    id: "F0709240001",
    content: "Rent fee",
    date: "07/09/2024",
    total: 15000000,
    currency: "VND",
    type: "expense",
  },
];

export default function Cost() {
  return (
    <div className="space-y-6 mt-3">
      {/* Thanh filter: search + date range + Monthly/Annually */}
      <CostFilterBar />

      {/* Bảng Income and expenses */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <CostTable rows={CostRows} />
      </section>
    </div>
  );
}
