"use client"

import { useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function seededData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  let base = 18000
  return days.map((d, i) => {
    base += Math.round(Math.sin(i) * 4200 + (i * 1500))
    const wagered = base
    const payout = Math.round(base * (0.9 + Math.sin(i * 1.3) * 0.04))
    return { day: d, wagered, payout, revenue: wagered - payout }
  })
}

export function RevenueChart() {
  const data = useMemo(seededData, [])

  return (
    <div className="glass rounded-2xl border border-border p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Revenue overview</h3>
          <p className="text-xs text-muted-foreground">Wagered vs payout, last 7 days</p>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="wageredFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.21 145)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.78 0.21 145)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="payoutFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.7 0.16 230)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="oklch(0.7 0.16 230)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.27 0.02 260)" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.7 0.02 260)", fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "oklch(0.7 0.02 260)", fontSize: 12 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "oklch(0.16 0.02 260)",
                border: "1px solid oklch(0.27 0.02 260)",
                borderRadius: 12,
                color: "oklch(0.96 0 0)",
                fontSize: 12,
              }}
              formatter={(value, name) => [`$${Number(value ?? 0).toLocaleString()}`, String(name)]}
            />
            <Area type="monotone" dataKey="wagered" stroke="oklch(0.78 0.21 145)" strokeWidth={2} fill="url(#wageredFill)" />
            <Area type="monotone" dataKey="payout" stroke="oklch(0.7 0.16 230)" strokeWidth={2} fill="url(#payoutFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
