'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const waterData = [
  { name: 'Meatless', water: 50 },
  { name: 'Shower', water: 15 },
  { name: 'Recycle', water: 10 },
  { name: 'Bag', water: 5 },
  { name: 'Bottle', water: 1 },
  { name: 'Lights', water: 0 }, // no water savings
];

function CustomWaterTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white text-gray-900 p-3 rounded-md shadow border border-gray-300 text-sm">
      <p className="font-semibold">{label}</p>
      <p>
        <span className="text-blue-600 font-medium">Water Saved:</span>{' '}
        {payload[0].value} L
      </p>
    </div>
  );
}

export default function WaterImpactChart() {
  return (
    <div className="bg-white/80 p-6 rounded-xl shadow-md border-l-4 border-blue-300">
      <h2 className="text-lg font-bold mb-4 text-blue-700">
        💧 Visual Breakdown – Water Saved per Challenge
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={waterData}>
          <XAxis dataKey="name" />
          <YAxis unit=" L" />
          <Tooltip content={<CustomWaterTooltip />} />
          <Bar dataKey="water" fill="#60a5fa" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
