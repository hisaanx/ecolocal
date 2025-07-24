// components/StatsBars.tsx
import { motion } from "framer-motion";

const stats = [
  {
    label: "Urban Population by 2050",
    value: 68,
    color: "bg-green-500",
  },
  {
    label: "Public Transport Access",
    value: 52,
    color: "bg-blue-500",
  },
  {
    label: "Without Waste Services",
    value: 25,
    color: "bg-red-500",
  },
];

export default function StatsBars() {
  return (
    <div className="space-y-8 mt-20 px-2">
      {/* 🔥 Upgraded Heading */}
      <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-blue-700 to-green-700 drop-shadow-lg tracking-wide font-quicksand text-center">
        🌆 Urban Challenges by the Numbers
      </h2>

      {stats.map((stat, i) => (
        <div key={i}>
          {/* 💬 Improved label row */}
          <div className="flex justify-between mb-1 text-base font-semibold text-gray-800">
            <span className="tracking-wide">{stat.label}</span>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.2 }}
              className="text-gray-900"
            >
              {stat.value}%
            </motion.span>
          </div>

          {/* 🌈 Bar */}
          <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
            <motion.div
              className={`h-full ${stat.color} rounded-full shadow-md`}
              initial={{ width: 0 }}
              whileInView={{ width: `${stat.value}%` }}
              transition={{ duration: 1 + i * 0.3 }}
            />
          </div>
        </div>
      ))}

      {/* 📎 Source */}
      <p className="text-xs text-gray-500 mt-6 text-right italic">
        Source: UN Habitat, World Bank Data 2023
      </p>
    </div>
  );
}
