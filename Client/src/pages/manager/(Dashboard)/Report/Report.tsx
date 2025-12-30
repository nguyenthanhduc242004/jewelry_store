import ReportFilterBar from "../../../../components/Report/ReportFilterBar/ReportFilterBar";
import ReportStats from "../../../../components/Report/ReportStats/ReportStats";
import ReportTable, {type ReportRow,} from "../../../../components/Report/ReportTable/ReportTable";
import ReportSearchBar from "../../../../components/Report/ReportSearchBar/ReportSearchBar";

const reportRows: ReportRow[] = [
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

export default function Report() {
  return (
    <div className="space-y-6 mt-3">
      <div className="space-y-4">
        <ReportSearchBar />
        <ReportFilterBar />
      </div>

      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <ReportStats />
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <ReportTable rows={reportRows} />
      </section>
    </div>
  );
}
