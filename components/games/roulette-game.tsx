"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
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
  const [history, setHistory] = useState<number[]>([17, 8, 0, 29, 14])
  const [wheelAngle, setWheelAngle] = useState(0)

  function evaluate(n: number): number {
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
    setWheelAngle((prev) => prev + 720 + Math.floor(Math.random() * 360))
    const n = Math.floor(Math.random() * 37)

    setTimeout(() => {
      const mult = evaluate(n)
      const payout = Math.round(amount * mult)
      settleBet({ game: "roulette", label: "Roulette", stake: amount, payout })
      setResult(n)
      setHistory((prev) => [n, ...prev].slice(0, 8))
      setSpinning(false)
      pushToast({
        title: mult > 0 ? `You won $${payout.toLocaleString()}!` : "You lost",
        description: `Landed on ${n} (${colorOf(n)})`,
        variant: mult > 0 ? "success" : "error",
      })
    }, 1800)
  }

  const isSelected = (candidate: BetType) => {
    if (candidate.kind !== bet.kind) return false
    if (candidate.kind === "number" && bet.kind === "number") return candidate.value === bet.value
    return candidate.kind !== "number" && bet.kind !== "number" && candidate.value === bet.value
  }

  const selectedMultiplier = bet.kind === "number" ? 36 : 2
  const selectedChance = bet.kind === "number" ? "2.7%" : "48.6%"
  const selectedLabel =
    bet.kind === "color"
      ? `${bet.value[0].toUpperCase()}${bet.value.slice(1)}`
      : bet.kind === "parity"
        ? `${bet.value[0].toUpperCase()}${bet.value.slice(1)}`
        : `Number ${bet.value}`

  const quickBets: Array<{ label: string; value: BetType; tone: string }> = [
    { label: "Red", value: { kind: "color", value: "red" }, tone: "bg-lose/15 text-lose" },
    { label: "Black", value: { kind: "color", value: "black" }, tone: "bg-foreground/10 text-foreground" },
    { label: "Even", value: { kind: "parity", value: "even" }, tone: "bg-primary/15 text-primary" },
    { label: "Odd", value: { kind: "parity", value: "odd" }, tone: "bg-neon-blue/15 text-neon-blue" },
    { label: "Zero", value: { kind: "number", value: 0 }, tone: "bg-neon-green/15 text-neon-green" },
  ]

  const resultTone =
    result === null
      ? "text-muted-foreground"
      : colorOf(result) === "red"
        ? "text-lose"
        : colorOf(result) === "black"
          ? "text-foreground"
          : "text-neon-green"

  return (
    <GameFrame
      stage={
        <>
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
            <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
              Recent spins
            </span>
            <div className="flex flex-wrap justify-end gap-1.5">
              {history.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className={cn(
                    "grid size-7 place-items-center rounded-full text-[11px] font-bold",
                    colorOf(item) === "red" && "bg-lose/20 text-lose",
                    colorOf(item) === "black" && "bg-muted text-foreground",
                    colorOf(item) === "green" && "bg-neon-green/20 text-neon-green",
                  )}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            animate={{ rotate: wheelAngle }}
            transition={
              spinning
                ? { duration: 1.8, ease: [0.22, 1, 0.36, 1] }
                : { type: "spring", stiffness: 220, damping: 24 }
            }
            className="relative mt-6 grid size-52 place-items-center rounded-full border border-border/80 shadow-[0_28px_90px_-48px_rgb(0_0_0_/_0.95)]"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 36%, rgba(0,0,0,0) 37%), conic-gradient(from 180deg, rgba(248,113,113,0.28) 0deg 60deg, rgba(17,24,39,0.58) 60deg 120deg, rgba(248,113,113,0.28) 120deg 180deg, rgba(17,24,39,0.58) 180deg 240deg, rgba(248,113,113,0.28) 240deg 300deg, rgba(34,197,94,0.28) 300deg 360deg)",
            }}
          >
            <div className="absolute inset-3 rounded-full border border-border/70 bg-background/90 shadow-inner" />
            <div className="absolute inset-8 rounded-full border border-border/80 bg-card/95" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background p-1 text-neon-green shadow-[0_12px_24px_-12px_rgb(90_214_255_/_0.8)]">
              <ChevronDown className="size-5" />
            </div>
            <div
              className={cn(
                "relative z-10 grid size-24 place-items-center rounded-full border border-border/80 text-4xl font-bold tabular-nums",
                result === null && "bg-card text-muted-foreground",
                result !== null && colorOf(result) === "red" && "bg-lose/20 text-lose",
                result !== null && colorOf(result) === "black" && "bg-muted text-foreground",
                result !== null && colorOf(result) === "green" && "bg-neon-green/20 text-neon-green glow-green",
              )}
            >
              {spinning ? "…" : result ?? "?"}
            </div>
          </motion.div>

          <div className="mt-5 flex flex-col items-center gap-2">
            <div className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
              {spinning ? "Spinning now" : result !== null ? `${result} landed` : "Ready to spin"}
            </div>
            <p className={cn("text-sm font-medium", resultTone)}>
              {result === null && "Pick a bet and send the wheel"}
              {spinning && "The wheel is in motion"}
              {result !== null && `Result: ${result} (${colorOf(result)})`}
            </p>
            <p className="text-xs text-muted-foreground">
              {spinning
                ? `Selected bet: ${selectedLabel} • ${selectedMultiplier}x payout`
                : `Selected bet: ${selectedLabel} • ${selectedChance} hit chance`}
            </p>
          </div>
        </>
      }
      controls={
        <>
          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">Quick bets</p>
            <div className="flex flex-wrap gap-2">
              {quickBets.map((quick) => (
                <button
                  key={quick.label}
                  type="button"
                  onClick={() => setBet(quick.value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                    isSelected(quick.value)
                      ? "border-transparent bg-gradient-to-r from-neon-green to-neon-blue text-primary-foreground"
                      : `${quick.tone} border-border/70 hover:-translate-y-0.5`,
                  )}
                >
                  {quick.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">Color</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBet({ kind: "color", value: "red" })}
                className={cn(
                  "rounded-2xl py-2.5 text-sm font-semibold transition-all",
                  isSelected({ kind: "color", value: "red" })
                    ? "bg-lose text-foreground glow-blue"
                    : "border border-border/70 bg-lose/15 text-lose hover:bg-lose/25",
                )}
              >
                Red 2×
              </button>
              <button
                type="button"
                onClick={() => setBet({ kind: "color", value: "black" })}
                className={cn(
                  "rounded-2xl py-2.5 text-sm font-semibold transition-all",
                  isSelected({ kind: "color", value: "black" })
                    ? "bg-foreground text-background"
                    : "border border-border/70 bg-muted text-foreground hover:bg-accent",
                )}
              >
                Black 2×
              </button>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">Even / Odd</p>
            <div className="grid grid-cols-2 gap-2">
              {(["even", "odd"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setBet({ kind: "parity", value })}
                  className={cn(
                    "rounded-2xl py-2.5 text-sm font-semibold capitalize transition-all",
                    isSelected({ kind: "parity", value })
                      ? "bg-primary text-primary-foreground glow-green"
                      : "border border-border/70 bg-background/45 text-muted-foreground hover:bg-accent",
                  )}
                >
                  {value} 2×
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
                  const value = Math.max(0, Math.min(36, Number(e.target.value)))
                  setBet({ kind: "number", value })
                }}
                className="h-10 rounded-2xl border border-input bg-input/40 px-3 text-sm font-semibold text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/25"
              />
              <div className="grid place-items-center rounded-2xl border border-border/70 bg-background/45 text-xs text-muted-foreground">
                {bet.kind === "number" ? `Betting on ${bet.value}` : "Pick a number"}
              </div>
            </div>
          </div>

          <BetInput amount={amount} setAmount={setAmount} balance={balance} disabled={spinning} />

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-border/70 bg-background/45 px-3 py-2 text-sm">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Odds
              </span>
              <span className="mt-1 block font-bold text-foreground">{selectedChance}</span>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/45 px-3 py-2 text-sm">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Payout
              </span>
              <span className="mt-1 block font-bold text-neon-purple">{selectedMultiplier}×</span>
            </div>
          </div>

          <button
            type="button"
            onClick={spin}
            disabled={spinning}
            className="h-12 rounded-2xl bg-gradient-to-r from-neon-green to-neon-blue text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
          >
            {spinning ? "Spinning…" : "Spin"}
          </button>
        </>
      }
    />
  )
}
