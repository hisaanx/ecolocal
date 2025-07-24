import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Meatless', co2: 1.5 },
  { name: 'Shower', co2: 0.2 },
  { name: 'Recycle', co2: 0.5 },
  { name: 'Bag', co2: 0.15 },
  { name: 'Bottle', co2: 0.1 },
  { name: 'Lights', co2: 0.2 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white text-gray-900 p-3 rounded-md shadow border border-gray-300 text-sm">
      <p className="font-semibold">{label}</p>
      <p>
        <span className="text-green-600 font-medium">CO₂ Saved:</span>{' '}
        {payload[0].value} kg
      </p>
    </div>
  );
}

export default function ImpactBarChart() {
  return (
    <div className="bg-white/80 p-6 rounded-xl shadow-md border-l-4 border-purple-300">
      <h2 className="text-lg font-bold mb-4 text-purple-700">
        📊 Visual Breakdown – CO₂ Saved per Challenge
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis unit=" kg" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="co2" fill="#4ade80" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
