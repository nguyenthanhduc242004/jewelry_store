import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Legend } from "recharts";

type StatLineCardProps = {
  title: string;
  data: Array<{ [key: string]: any }>;
  currentKey: string;
  lastKey: string;
};

export function CompareBarChart({
  data,
  currentKey,
  lastKey
}: {
  data: Array<{ [key: string]: any }>;
  currentKey: string;
  lastKey: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        barGap={6}
        barCategoryGap="20%"
        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
      >
        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey={currentKey} fill="#3498db" radius={[6, 6, 0, 0]} name="This Week" />
        <Bar dataKey={lastKey} fill="#dcdcdc" radius={[6, 6, 0, 0]} name="Last Week" />
      </BarChart>
    </ResponsiveContainer>
  );
}

const StatLineCard = ({ title, data, currentKey, lastKey }: StatLineCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-xs text-gray-400 mb-4">Orders created per day</p>

      <div className="h-52 mt-4">
        <CompareBarChart data={data} currentKey={currentKey} lastKey={lastKey} />
      </div>
    </div>
  );
};

export default StatLineCard;
