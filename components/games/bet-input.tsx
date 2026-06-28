"use client"

import { Minus, Plus } from "lucide-react"

export function BetInput({
  amount,
  setAmount,
  balance,
  disabled,
}: {
  amount: number
  setAmount: (n: number) => void
  balance: number
  disabled?: boolean
}) {
  const clamp = (n: number) => Math.max(0, Math.min(balance, Math.round(n)))

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">Bet amount</label>
        <span className="text-xs text-muted-foreground">Bal: ${balance.toLocaleString()}</span>
      </div>
      <div className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">$</span>
          <input
            type="number"
            min={0}
            value={amount}
            disabled={disabled}
            onChange={(e) => setAmount(clamp(Number(e.target.value)))}
            className="h-12 w-full rounded-2xl border border-border/70 bg-background/50 pr-3 pl-7 text-base font-semibold text-foreground outline-none transition-all focus:border-ring focus:ring-3 focus:ring-ring/25 disabled:opacity-50"
          />
        </div>
        <button
          onClick={() => setAmount(clamp(amount / 2))}
          disabled={disabled}
          className="rounded-2xl border border-border/70 bg-card/70 px-3 text-xs font-semibold text-muted-foreground transition-colors hover:-translate-y-0.5 hover:bg-accent hover:text-foreground disabled:opacity-50"
        >
          ½
        </button>
        <button
          onClick={() => setAmount(clamp(amount * 2))}
          disabled={disabled}
          className="rounded-2xl border border-border/70 bg-card/70 px-3 text-xs font-semibold text-muted-foreground transition-colors hover:-translate-y-0.5 hover:bg-accent hover:text-foreground disabled:opacity-50"
        >
          2×
        </button>
        <button
          onClick={() => setAmount(balance)}
          disabled={disabled}
          className="rounded-2xl border border-border/70 bg-card/70 px-3 text-xs font-semibold text-muted-foreground transition-colors hover:-translate-y-0.5 hover:bg-accent hover:text-foreground disabled:opacity-50"
        >
          Max
        </button>
      </div>
      <div className="mt-2 flex gap-2">
        {[10, 25, 50, 100].map((q) => (
          <button
            key={q}
            onClick={() => setAmount(clamp(amount + q))}
            disabled={disabled}
            className="flex flex-1 items-center justify-center gap-0.5 rounded-xl border border-border/70 bg-card/70 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:-translate-y-0.5 hover:bg-accent hover:text-foreground disabled:opacity-50"
          >
            <Plus className="size-3" />
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
