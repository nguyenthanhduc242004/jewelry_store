import { CompareBarChart } from "../../../components/common/StatLineCard/StatLineCard";
import { useNavigate } from "react-router-dom";
const revenueCostData = [
  { day: "01", revenue: 48, cost: 30 },
  { day: "02", revenue: 40, cost: 25 },
  { day: "03", revenue: 60, cost: 50 },
  { day: "04", revenue: 50, cost: 45 },
  { day: "05", revenue: 52, cost: 48 },
  { day: "06", revenue: 65, cost: 40 },
  { day: "07", revenue: 70, cost: 60 }
];
export default function ReportStats() {
  const navigate = useNavigate();

  const handleGotoRevenue = () => {
    navigate("/manager/report/revenue");
  };
  const handleGotoCost = () => {
    navigate("/manager/report/cost");
  };
  return (
    <div>
      {/* Revenue & Cost */}
      <div className="flex flex-wrap justify-between gap-8">
        {/* Revenue */}
        <div onClick={handleGotoRevenue}>
          <p className="text-sm font-semibold text-slate-600">Revenue</p>
          <p className="mt-1 text-2xl font-bold">79.852.000 VND</p>
          <p className="mt-1 text-xs text-green-600">↑ 2.1% vs last week</p>
          <p className="mt-1 text-[11px] text-slate-400">Sales from 1–7 Sep, 2024</p>
        </div>

        {/* Cost */}
        <div>
          <div onClick={handleGotoCost}>
            <p className="text-sm font-semibold text-slate-600">Cost</p>
            <p className="mt-1 text-2xl font-bold">75.852.000 VND</p>
            <p className="mt-1 text-xs text-green-600">↑ 2.1% vs last week</p>
            <p className="mt-1 text-[11px] text-slate-400">Sales from 1–7 Sep, 2024</p>
          </div>
        </div>
      </div>

      {/* Chart (placeholder) */}
      <div className="mt-6 h-64 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
        <CompareBarChart data={revenueCostData} currentKey="revenue" lastKey="cost" />
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
          Revenue
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-slate-300" />
          Cost
        </div>
      </div>
    </div>
  );
}
