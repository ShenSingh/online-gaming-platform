"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { usePlatform } from "@/components/providers/platform-provider"
import { BetInput } from "@/components/games/bet-input"
import { GameFrame } from "@/components/games/game-frame"
import { cn } from "@/lib/utils"

const REDS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36])
type BetType =
  | { kind: "color"; value: "red" | "black" }
  | { kind: "parity"; value: "even" | "odd" }
  | { kind: "number"; value: number }

function colorOf(n: number) {
  if (n === 0) return "green"
  return REDS.has(n) ? "red" : "black"
}

export function RouletteGame() {
  const { balance, settleBet, pushToast } = usePlatform()
  const [amount, setAmount] = useState(50)
  const [bet, setBet] = useState<BetType>({ kind: "color", value: "red" })
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [history, setHistory] = useState<number[]>([])

  function evaluate(n: number): number {
    // returns multiplier won (0 if lose)
    if (bet.kind === "color") return colorOf(n) === bet.value ? 2 : 0
    if (bet.kind === "parity") {
      if (n === 0) return 0
      const parity = n % 2 === 0 ? "even" : "odd"
      return parity === bet.value ? 2 : 0
    }
    return n === bet.value ? 36 : 0
  }

  function spin() {
    if (spinning) return
    if (amount <= 0) return pushToast({ title: "Enter a bet amount", variant: "error" })
    if (amount > balance) return pushToast({ title: "Insufficient balance", variant: "error" })

    setSpinning(true)
    setResult(null)
    const n = Math.floor(Math.random() * 37)

    setTimeout(() => {
      const mult = evaluate(n)
      const payout = Math.round(amount * mult)
      settleBet({ game: "roulette", label: "Roulette", stake: amount, payout })
      setResult(n)
      setHistory((h) => [n, ...h].slice(0, 8))
      setSpinning(false)
      pushToast({
        title: mult > 0 ? `You won $${payout.toLocaleString()}!` : "You lost",
        description: `Landed on ${n} (${colorOf(n)})`,
        variant: mult > 0 ? "success" : "error",
      })
    }, 1800)
  }

  const isSelected = (b: BetType) =>
    bet.kind === b.kind && (b.kind === "number" ? bet.kind === "number" && bet.value === b.value : (bet as any).value === (b as any).value)

  return (
    <GameFrame
      stage={
        <>
          <div className="absolute top-4 left-0 flex w-full justify-center gap-1.5 px-4">
            {history.map((h, i) => (
              <span
                key={i}
                className={cn(
                  "grid size-6 place-items-center rounded-full text-[11px] font-bold",
                  colorOf(h) === "red" && "bg-lose/20 text-lose",
                  colorOf(h) === "black" && "bg-muted text-foreground",
                  colorOf(h) === "green" && "bg-neon-green/20 text-neon-green",
                )}
              >
                {h}
              </span>
            ))}
          </div>

          <motion.div
            animate={spinning ? { rotate: 360 } : {}}
            transition={{ repeat: spinning ? Infinity : 0, duration: 0.8, ease: "linear" }}
            className="grid size-40 place-items-center rounded-full border-4 border-border bg-gradient-to-br from-muted via-card to-background"
          >
            <div
              className={cn(
                "grid size-24 place-items-center rounded-full text-4xl font-bold tabular-nums",
                result === null && "bg-card text-muted-foreground",
                result !== null && colorOf(result) === "red" && "bg-lose/20 text-lose",
                result !== null && colorOf(result) === "black" && "bg-muted text-foreground",
                result !== null && colorOf(result) === "green" && "bg-neon-green/20 text-neon-green glow-green",
              )}
            >
              {spinning ? "…" : result ?? "?"}
            </div>
          </motion.div>
        </>
      }
      controls={
        <>
          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">Color</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setBet({ kind: "color", value: "red" })}
                className={cn(
                  "rounded-xl py-2.5 text-sm font-semibold transition-all",
                  isSelected({ kind: "color", value: "red" })
                    ? "bg-lose text-foreground glow-blue"
                    : "border border-border bg-lose/15 text-lose hover:bg-lose/25",
                )}
              >
                Red 2×
              </button>
              <button
                onClick={() => setBet({ kind: "color", value: "black" })}
                className={cn(
                  "rounded-xl py-2.5 text-sm font-semibold transition-all",
                  isSelected({ kind: "color", value: "black" })
                    ? "bg-foreground text-background"
                    : "border border-border bg-muted text-foreground hover:bg-accent",
                )}
              >
                Black 2×
              </button>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">Even / Odd</p>
            <div className="grid grid-cols-2 gap-2">
              {(["even", "odd"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setBet({ kind: "parity", value: v })}
                  className={cn(
                    "rounded-xl py-2.5 text-sm font-semibold capitalize transition-all",
                    isSelected({ kind: "parity", value: v })
                      ? "bg-primary text-primary-foreground glow-green"
                      : "border border-border text-muted-foreground hover:bg-accent",
                  )}
                >
                  {v} 2×
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Straight number</span>
              <span className="text-neon-purple">36×</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={0}
                max={36}
                placeholder="0-36"
                onChange={(e) => {
                  const v = Math.max(0, Math.min(36, Number(e.target.value)))
                  setBet({ kind: "number", value: v })
                }}
                className="h-10 rounded-xl border border-input bg-input/40 px-3 text-sm font-semibold text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/25"
              />
              <div className="grid place-items-center rounded-xl border border-border text-xs text-muted-foreground">
                {bet.kind === "number" ? `Betting on ${bet.value}` : "Pick a number"}
              </div>
            </div>
          </div>

          <BetInput amount={amount} setAmount={setAmount} balance={balance} disabled={spinning} />

          <button
            onClick={spin}
            disabled={spinning}
            className="h-12 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-all hover:opacity-90 glow-green disabled:opacity-50"
          >
            {spinning ? "Spinning…" : "Spin"}
          </button>
        </>
      }
    />
  )
}
