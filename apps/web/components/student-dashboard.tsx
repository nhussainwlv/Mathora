"use client";

import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";

const weeklyData = [
  { day: "Mon", score: 64 },
  { day: "Tue", score: 71 },
  { day: "Wed", score: 75 },
  { day: "Thu", score: 81 },
  { day: "Fri", score: 88 },
];

export function StudentDashboard() {
  const [xp, setXp] = useState(2480);
  const [coins, setCoins] = useState(120);
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "XP Points", value: xp.toLocaleString() },
          { title: "Current Level", value: "12" },
          { title: "Daily Streak", value: "14 days" },
          { title: "Accuracy", value: "87.4%" },
        ].map((metric) => (
          <motion.div
            key={metric.title}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/60"
          >
            <p className="text-sm text-slate-600 dark:text-slate-300">{metric.title}</p>
            <p className="mt-2 text-2xl font-bold">{metric.value}</p>
          </motion.div>
        ))}
      </section>

      <section className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setXp((prev) => prev + 25);
            setCoins((prev) => prev + 5);
            setMessage("Daily challenge completed: +25 XP, +5 coins.");
          }}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
        >
          Complete daily challenge
        </button>
        <button
          type="button"
          onClick={() => setMessage("Recommendation refreshed for your weakest topics.")}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
        >
          Refresh recommendations
        </button>
        <button
          type="button"
          onClick={() => {
            setCoins((prev) => prev + 10);
            setMessage("Daily login reward claimed: +10 coins.");
          }}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
        >
          Claim login reward
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-white/20 bg-white/60 p-4 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/60">
          <h3 className="mb-3 text-lg font-semibold">Weekly Progress</h3>
          <div className="overflow-x-auto">
            <BarChart width={680} height={240} data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </div>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/60">
          <h3 className="mb-3 text-lg font-semibold">Achievements</h3>
          <ul className="space-y-2 text-sm">
            <li className="rounded-xl bg-emerald-100/70 px-3 py-2 dark:bg-emerald-900/40">7-Day Scholar</li>
            <li className="rounded-xl bg-blue-100/70 px-3 py-2 dark:bg-blue-900/40">Fraction Master</li>
            <li className="rounded-xl bg-purple-100/70 px-3 py-2 dark:bg-purple-900/40">Speed Maths Hero</li>
          </ul>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Coins: {coins}</p>
        </div>
      </section>

      {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
    </div>
  );
}
