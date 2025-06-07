// components/TimeStats.tsx
"use client";

import { motion } from "framer-motion";

export interface TimeStat {
  value: string;
  label: string;
}

export default function TimeStats({ stats }: { stats: TimeStat[] }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white p-6 rounded-lg shadow"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="bg-blue-50 rounded-lg p-6 text-center"
          >
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {stat.value}
            </p>
            <p className="text-gray-700">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
