"use client"

import { ArrowDownLeft, ArrowUpRight, Dices, Trophy } from "lucide-react"
import type { Transaction } from "@/lib/types"
import { usd, timeAgo } from "@/lib/format"
import { cn } from "@/lib/utils"

const meta = {
  deposit: { icon: ArrowDownLeft, color: "text-neon-green", bg: "bg-neon-green/15" },
  withdraw: { icon: ArrowUpRight, color: "text-neon-blue", bg: "bg-neon-blue/15" },
  bet: { icon: Dices, color: "text-muted-foreground", bg: "bg-muted" },
  win: { icon: Trophy, color: "text-neon-green", bg: "bg-neon-green/15" },
}

export function TransactionList({ items, limit }: { items: Transaction[]; limit?: number }) {
  const list = limit ? items.slice(0, limit) : items

  if (list.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No transactions yet.</p>
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {list.map((t) => {
        const m = meta[t.type]
        const Icon = m.icon
        const positive = t.amount > 0
        return (
          <li key={t.id} className="flex items-center gap-3 py-3">
            <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", m.bg, m.color)}>
              <Icon className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{t.label}</p>
              <p className="text-xs text-muted-foreground">{timeAgo(t.createdAt)}</p>
            </div>
            <span
              className={cn(
                "shrink-0 text-sm font-semibold tabular-nums",
                positive ? "text-neon-green" : "text-foreground",
              )}
            >
              {usd(t.amount, { sign: true })}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
