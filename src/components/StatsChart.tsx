// src/components/StatsChart.tsx
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

type Props = {
  data: { name: string; points: number }[];
};

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

export function StatsChart({ data }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-10">
      <h3 className="text-lg font-semibold text-green-700 mb-4">🏆 Top Users by Points</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
          contentStyle={{
            backgroundColor: "#cbe8d4ff", // soft green
            borderColor: "#22c55e",  // green-500
            color: "#14532d", // text-green-900
            fontWeight: 600,
          }}
          />
          <Bar dataKey="points">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
