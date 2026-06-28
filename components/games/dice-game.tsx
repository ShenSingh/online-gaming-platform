"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePlatform } from "@/components/providers/platform-provider"
import { BetInput } from "@/components/games/bet-input"
import { GameFrame } from "@/components/games/game-frame"
import { cn } from "@/lib/utils"

type Mode = "over" | "under"

export function DiceGame() {
  const { balance, settleBet, pushToast } = usePlatform()
  const [amount, setAmount] = useState(50)
  const [target, setTarget] = useState(50)
  const [mode, setMode] = useState<Mode>("over")
  const [rolling, setRolling] = useState(false)
  const [roll, setRoll] = useState<number | null>(null)
  const [won, setWon] = useState<boolean | null>(null)

  // win chance & multiplier (1% house edge)
  const winChance = mode === "over" ? 100 - target : target
  const multiplier = winChance > 0 ? (99 / winChance) : 0

  function play() {
    if (rolling) return
    if (amount <= 0) return pushToast({ title: "Enter a bet amount", variant: "error" })
    if (amount > balance) return pushToast({ title: "Insufficient balance", variant: "error" })
    if (winChance <= 0 || winChance >= 100) return pushToast({ title: "Adjust your target", variant: "error" })

    setRolling(true)
    setWon(null)
    const result = Math.floor(Math.random() * 100) + 1

    // animate counter
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
          <div className="flex flex-col items-center">
            <motion.div
              key={won === null ? "idle" : won ? "win" : "lose"}
              animate={rolling ? { rotate: [0, -8, 8, 0] } : {}}
              transition={{ repeat: rolling ? Infinity : 0, duration: 0.3 }}
              className={cn(
                "grid size-32 place-items-center rounded-3xl border-2 text-5xl font-bold tabular-nums transition-colors",
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
                  className={cn("mt-4 text-lg font-bold", won ? "text-neon-green" : "text-lose")}
                >
                  {won ? "WIN" : "BUST"}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* target slider track */}
          <div className="mt-8 w-full max-w-md">
            <div className="relative h-2.5 rounded-full bg-muted">
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
            <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
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
              onClick={() => setMode("under")}
              className={cn(
                "rounded-xl py-2.5 text-sm font-semibold transition-all",
                mode === "under" ? "bg-primary text-primary-foreground glow-green" : "border border-border text-muted-foreground hover:bg-accent",
              )}
            >
              Roll Under
            </button>
            <button
              onClick={() => setMode("over")}
              className={cn(
                "rounded-xl py-2.5 text-sm font-semibold transition-all",
                mode === "over" ? "bg-primary text-primary-foreground glow-green" : "border border-border text-muted-foreground hover:bg-accent",
              )}
            >
              Roll Over
            </button>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Target: {target}</span>
              <span className="text-muted-foreground">{winChance.toFixed(0)}% chance</span>
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

          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-sm">
            <span className="text-muted-foreground">Multiplier</span>
            <span className="font-bold text-neon-green">{multiplier.toFixed(2)}×</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-sm">
            <span className="text-muted-foreground">Win payout</span>
            <span className="font-bold text-foreground">${Math.round(amount * multiplier).toLocaleString()}</span>
          </div>

          <button
            onClick={play}
            disabled={rolling}
            className="h-12 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-all hover:opacity-90 glow-green disabled:opacity-50"
          >
            {rolling ? "Rolling…" : "Roll Dice"}
          </button>
        </>
      }
    />
  )
}
