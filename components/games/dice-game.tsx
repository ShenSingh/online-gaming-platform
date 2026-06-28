"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePlatform } from "@/components/providers/platform-provider"
import { BetInput } from "@/components/games/bet-input"
import { GameFrame } from "@/components/games/game-frame"
import { cn } from "@/lib/utils"

type Mode = "over" | "under"

const quickSets: Array<{
  label: string
  mode: Mode
  target: number
  hint: string
}> = [
  { label: "Safe", mode: "under", target: 72, hint: "72% chance" },
  { label: "Balanced", mode: "under", target: 50, hint: "50% chance" },
  { label: "Spicy", mode: "over", target: 78, hint: "22% chance" },
  { label: "Risky", mode: "over", target: 90, hint: "10% chance" },
]

export function DiceGame() {
  const { balance, settleBet, pushToast } = usePlatform()
  const [amount, setAmount] = useState(50)
  const [target, setTarget] = useState(50)
  const [mode, setMode] = useState<Mode>("over")
  const [rolling, setRolling] = useState(false)
  const [roll, setRoll] = useState<number | null>(null)
  const [won, setWon] = useState<boolean | null>(null)
  const [history, setHistory] = useState<number[]>([68, 14, 81, 42, 95])

  const winChance = mode === "over" ? 100 - target : target
  const multiplier = winChance > 0 ? 99 / winChance : 0
  const payout = Math.round(amount * multiplier)
  const riskLabel =
    winChance >= 70 ? "safer" : winChance >= 45 ? "balanced" : winChance >= 20 ? "high risk" : "elite risk"
  const riskTone =
    winChance >= 70 ? "text-neon-green" : winChance >= 45 ? "text-neon-blue" : "text-neon-purple"

  function applyPreset(nextMode: Mode, nextTarget: number) {
    if (rolling) return
    setMode(nextMode)
    setTarget(nextTarget)
  }

  function play() {
    if (rolling) return
    if (amount <= 0) return pushToast({ title: "Enter a bet amount", variant: "error" })
    if (amount > balance) return pushToast({ title: "Insufficient balance", variant: "error" })
    if (winChance <= 0 || winChance >= 100) return pushToast({ title: "Adjust your target", variant: "error" })

    setRolling(true)
    setWon(null)
    const result = Math.floor(Math.random() * 100) + 1

    let ticks = 0
    const iv = setInterval(() => {
      setRoll(Math.floor(Math.random() * 100) + 1)
      ticks++
      if (ticks > 12) {
        clearInterval(iv)
        setRoll(result)
        const win = mode === "over" ? result > target : result < target
        const payout = win ? Math.round(amount * multiplier) : 0
        settleBet({ game: "dice", label: "Dice", stake: amount, payout })
        setWon(win)
        setHistory((prev) => [result, ...prev].slice(0, 6))
        setRolling(false)
        pushToast({
          title: win ? `You won $${payout.toLocaleString()}!` : "You lost",
          description: `Rolled ${result}`,
          variant: win ? "success" : "error",
        })
      }
    }, 60)
  }

  return (
    <GameFrame
      stage={
        <>
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
            <div className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
              Recent rolls
            </div>
            <div className="flex flex-wrap justify-end gap-1.5">
              {history.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className={cn(
                    "grid size-8 place-items-center rounded-full border text-xs font-bold tabular-nums",
                    item > target && mode === "over"
                      ? "border-neon-green/30 bg-neon-green/15 text-neon-green"
                      : item < target && mode === "under"
                        ? "border-neon-green/30 bg-neon-green/15 text-neon-green"
                        : "border-border/70 bg-background/45 text-foreground",
                  )}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center pt-10">
            <motion.div
              key={won === null ? "idle" : won ? "win" : "lose"}
              animate={rolling ? { rotate: [0, -10, 10, -6, 6, 0], scale: [1, 1.03, 1] } : {}}
              transition={{ repeat: rolling ? Infinity : 0, duration: 0.35 }}
              className={cn(
                "grid size-36 place-items-center rounded-[2rem] border-2 text-5xl font-bold tabular-nums transition-all sm:size-40 sm:text-6xl",
                won === null && "border-border bg-card text-foreground",
                won === true && "border-neon-green bg-neon-green/10 text-neon-green glow-green",
                won === false && "border-lose bg-lose/10 text-lose",
              )}
            >
              {roll ?? "?"}
            </motion.div>
            <AnimatePresence>
              {won !== null && !rolling && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn("mt-4 text-lg font-bold uppercase tracking-[0.25em]", won ? "text-neon-green" : "text-lose")}
                >
                  {won ? "WIN" : "BUST"}
                </motion.p>
              )}
            </AnimatePresence>
            <p className={cn("mt-2 text-center text-sm text-muted-foreground", rolling && "opacity-80")}>
              {rolling
                ? "Rolling the dice..."
                : `Roll ${mode === "over" ? "over" : "under"} ${target} to chase ${multiplier.toFixed(2)}x`}
            </p>
          </div>

          <div className="mt-8 grid w-full max-w-md gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full border border-border/70 bg-background/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {riskLabel}
              </span>
              <span className={cn("text-sm font-semibold", riskTone)}>{winChance.toFixed(0)}% chance</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {quickSets.map((preset) => {
                const activePreset = preset.mode === mode && preset.target === target
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset.mode, preset.target)}
                    className={cn(
                      "rounded-2xl border px-3 py-2 text-left transition-all",
                      activePreset
                        ? "border-transparent bg-gradient-to-r from-neon-green/20 to-neon-blue/20 text-foreground shadow-[0_16px_32px_-22px_rgb(90_214_255_/_0.85)]"
                        : "border-border/70 bg-background/45 text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    <span className="block text-xs font-semibold">{preset.label}</span>
                    <span className="block text-[11px] text-muted-foreground">{preset.hint}</span>
                  </button>
                )
              })}
            </div>
            <div className="relative h-3 rounded-full bg-muted">
              <div
                className={cn(
                  "absolute inset-y-0 rounded-full",
                  mode === "over" ? "bg-neon-green right-0" : "bg-neon-green left-0",
                )}
                style={mode === "over" ? { left: `${target}%` } : { right: `${100 - target}%` }}
              />
              <div
                className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-foreground"
                style={{ left: `${target}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </>
      }
      controls={
        <>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("under")}
              className={cn(
                "rounded-2xl py-2.5 text-sm font-semibold transition-all",
                mode === "under"
                  ? "bg-gradient-to-r from-neon-green to-neon-blue text-primary-foreground shadow-[0_16px_32px_-22px_rgb(90_214_255_/_0.85)]"
                  : "border border-border/70 bg-background/45 text-muted-foreground hover:bg-accent",
              )}
            >
              Roll Under
            </button>
            <button
              type="button"
              onClick={() => setMode("over")}
              className={cn(
                "rounded-2xl py-2.5 text-sm font-semibold transition-all",
                mode === "over"
                  ? "bg-gradient-to-r from-neon-green to-neon-blue text-primary-foreground shadow-[0_16px_32px_-22px_rgb(90_214_255_/_0.85)]"
                  : "border border-border/70 bg-background/45 text-muted-foreground hover:bg-accent",
              )}
            >
              Roll Over
            </button>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Target: {target}</span>
              <span className={cn("font-semibold", riskTone)}>{winChance.toFixed(0)}% chance</span>
            </div>
            <input
              type="range"
              min={2}
              max={98}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              disabled={rolling}
              className="w-full accent-[var(--neon-green)]"
            />
          </div>

          <BetInput amount={amount} setAmount={setAmount} balance={balance} disabled={rolling} />

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-border/70 bg-background/45 px-3 py-2 text-sm">
              <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Multiplier</span>
              <span className="mt-1 block font-bold text-neon-green">{multiplier.toFixed(2)}×</span>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/45 px-3 py-2 text-sm">
              <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Win payout</span>
              <span className="mt-1 block font-bold text-foreground">${payout.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={play}
            disabled={rolling}
            className="h-12 rounded-2xl bg-gradient-to-r from-neon-green to-neon-blue text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
          >
            {rolling ? "Rolling…" : "Roll Dice"}
          </button>
        </>
      }
    />
  )
}
