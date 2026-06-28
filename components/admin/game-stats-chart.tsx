"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { GameStat } from "@/lib/types"

const COLORS: Record<string, string> = {
  dice: "oklch(0.78 0.21 145)",
  aviator: "oklch(0.68 0.2 25)",
  roulette: "oklch(0.62 0.2 300)",
  slots: "oklch(0.7 0.16 230)",
}

export function GameStatsChart({ stats }: { stats: GameStat[] }) {
  const data = stats.map((s) => ({
    name: s.label,
    key: s.game,
    revenue: s.wagered - s.payout,
  }))

  return (
    <div className="glass rounded-2xl border border-border p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">Revenue by game</h3>
        <p className="text-xs text-muted-foreground">House edge earnings per game</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.27 0.02 260)" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.7 0.02 260)", fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "oklch(0.7 0.02 260)", fontSize: 12 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ fill: "oklch(0.27 0.02 260 / 0.3)" }}
              contentStyle={{
                background: "oklch(0.16 0.02 260)",
                border: "1px solid oklch(0.27 0.02 260)",
                borderRadius: 12,
                color: "oklch(0.96 0 0)",
                fontSize: 12,
              }}
              formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, "Revenue"]}
            />
            <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.key} fill={COLORS[d.key]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
