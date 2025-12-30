import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";

type RevenueChartProps = {
  thisWeekData: Array<{ day: string; revenue: number }>;
  lastWeekData: Array<{ day: string; revenue: number }>;
};

export default function RevenueChart({ thisWeekData, lastWeekData }: RevenueChartProps) {
  // Combine data for line chart
  const data = thisWeekData.map((item, index) => ({
    day: item.day,
    thisWeek: item.revenue,
    lastWeek: lastWeekData[index]?.revenue || 0
  }));

  return (
    <div className="h-64 w-full px-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => value.toLocaleString("vi-VN") + " VND"} />
          <ReferenceLine y={0} stroke="#999" strokeDasharray="5 5" strokeWidth={1} />
          <Legend />
          <Line
            type="monotone"
            dataKey="thisWeek"
            stroke="#3498db"
            strokeWidth={2}
            name="This Week"
          />
          <Line
            type="monotone"
            dataKey="lastWeek"
            stroke="#dcdcdc"
            strokeWidth={2}
            name="Last Week"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
