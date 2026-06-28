"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Plane } from "lucide-react"
import { usePlatform } from "@/components/providers/platform-provider"
import { BetInput } from "@/components/games/bet-input"
import { GameFrame } from "@/components/games/game-frame"
import { cn } from "@/lib/utils"

type Phase = "idle" | "flying" | "crashed" | "cashed"

export function AviatorGame() {
  const { balance, settleBet, pushToast } = usePlatform()
  const [amount, setAmount] = useState(50)
  const [phase, setPhase] = useState<Phase>("idle")
  const [multiplier, setMultiplier] = useState(1)
  const [history, setHistory] = useState<number[]>([2.31, 1.04, 5.7, 1.88, 3.42])
  const [cashedAt, setCashedAt] = useState<number | null>(null)
  const [autoCashout, setAutoCashout] = useState<number | null>(null)

  const crashRef = useRef(1)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef(0)
  const stakeRef = useRef(0)

  function randomCrash() {
    // house edge crash distribution; occasionally instant crash
    const r = Math.random()
    if (r < 0.04) return 1.0
    return Math.max(1.01, Number((0.99 / (1 - r)).toFixed(2)))
  }

  function tick(now: number) {
    const elapsed = (now - startRef.current) / 1000
    const m = Number(Math.pow(1.07, elapsed * 10).toFixed(2))
    if (m >= crashRef.current) {
      setMultiplier(crashRef.current)
      endRound(false)
      return
    }
    if (autoCashout && m >= autoCashout) {
      setMultiplier(autoCashout)
      completeCashOut(autoCashout)
      return
    }
    setMultiplier(m)
    rafRef.current = requestAnimationFrame(tick)
  }

  function endRound(cashed: boolean, payout = 0) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    if (cashed) {
      setPhase("cashed")
    } else {
      setPhase("crashed")
      // settle the lost bet
      settleBet({ game: "aviator", label: "Aviator", stake: stakeRef.current, payout })
      pushToast({ title: "Crashed!", description: `Busted at ${crashRef.current.toFixed(2)}×`, variant: "error" })
    }
    setHistory((h) => [crashRef.current, ...h].slice(0, 6))
    setTimeout(() => setPhase("idle"), 2200)
  }

  function completeCashOut(cashValue: number) {
    if (phase !== "flying") return
    const payout = Math.round(stakeRef.current * cashValue)
    setCashedAt(cashValue)
    settleBet({ game: "aviator", label: `Aviator ${cashValue.toFixed(2)}x`, stake: stakeRef.current, payout })
    pushToast({
      title: `Cashed out ${cashValue.toFixed(2)}×`,
      description: `+$${payout.toLocaleString()}`,
      variant: "success",
    })
    endRound(true, payout)
  }

  function launch() {
    if (phase === "flying") return
    if (amount <= 0) return pushToast({ title: "Enter a bet amount", variant: "error" })
    if (amount > balance) return pushToast({ title: "Insufficient balance", variant: "error" })
    stakeRef.current = amount
    crashRef.current = randomCrash()
    setCashedAt(null)
    setMultiplier(1)
    setPhase("flying")
    startRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
  }

  function cashOut() {
    if (phase !== "flying") return
    completeCashOut(multiplier)
  }

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  const flying = phase === "flying"
  const crashed = phase === "crashed"
  const presets = [1.5, 2, 3, 5]
  const crashAt = crashRef.current.toFixed(2)

  return (
    <GameFrame
      stage={
        <>
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
            <div className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
              Crash history
            </div>
            <div className="flex flex-wrap justify-end gap-1.5">
              {history.map((h, i) => (
                <span
                  key={i}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-bold",
                    h >= 2 ? "bg-neon-green/15 text-neon-green" : "bg-lose/15 text-lose",
                  )}
                >
                  {h.toFixed(2)}×
                </span>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-8 bottom-20 h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent" />

          <motion.div
            key={phase}
            animate={flying ? { scale: [1, 1.04, 1] } : {}}
            transition={{ repeat: flying ? Infinity : 0, duration: 0.4 }}
            className={cn(
              "text-6xl font-bold tabular-nums sm:text-7xl",
              crashed ? "text-lose" : phase === "cashed" ? "text-neon-green text-glow-green" : "text-foreground",
            )}
          >
            {multiplier.toFixed(2)}×
          </motion.div>
          <p className={cn("mt-2 text-sm font-medium", crashed ? "text-lose" : "text-muted-foreground")}>
            {phase === "idle" && "Place your bet and take off"}
            {flying && "Flying... cash out before the next hit"}
            {crashed && `Crashed at ${crashAt}×`}
            {phase === "cashed" && cashedAt && `Cashed out at ${cashedAt.toFixed(2)}×`}
          </p>

          <motion.div
            className="absolute bottom-6 left-6 text-neon-blue"
            animate={
              flying
                ? { x: [0, 56, 116], y: [0, -24, -68], rotate: -12 }
                : crashed
                  ? { x: 200, y: -160, opacity: 0, rotate: -30 }
                  : { x: 0, y: 0, opacity: 1, rotate: 0 }
            }
            transition={{ duration: flying ? 4 : 0.8, ease: "easeOut" }}
          >
            <Plane className="size-9 rotate-45" />
          </motion.div>
        </>
      }
      controls={
        <>
          <div className="rounded-2xl border border-border/70 bg-background/45 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Auto cashout</span>
              <span className="text-xs text-muted-foreground">
                {autoCashout ? `${autoCashout.toFixed(2)}x armed` : "Manual mode"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => setAutoCashout(null)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                  autoCashout === null
                    ? "border-transparent bg-gradient-to-r from-neon-green to-neon-blue text-primary-foreground"
                    : "border-border/70 bg-card/70 text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                Manual
              </button>
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAutoCashout(preset)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                    autoCashout === preset
                      ? "border-transparent bg-gradient-to-r from-neon-green to-neon-blue text-primary-foreground"
                      : "border-border/70 bg-card/70 text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {preset.toFixed(1)}x
                </button>
              ))}
            </div>
          </div>

          <BetInput amount={amount} setAmount={setAmount} balance={balance} disabled={flying} />

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-border/70 bg-background/45 px-3 py-2 text-sm">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Crash point
              </span>
              <span className="mt-1 block font-bold text-foreground">{crashAt}×</span>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/45 px-3 py-2 text-sm">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Flight mode
              </span>
              <span className="mt-1 block font-bold text-neon-blue">
                {autoCashout ? `${autoCashout.toFixed(1)}x auto` : "Manual"}
              </span>
            </div>
          </div>

          {flying ? (
            <button
              type="button"
              onClick={cashOut}
              className="h-14 rounded-2xl bg-gradient-to-r from-neon-green to-neon-blue text-base font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Cash Out ${Math.round(amount * multiplier).toLocaleString()}
            </button>
          ) : (
            <button
              type="button"
              onClick={launch}
              disabled={phase === "crashed" || phase === "cashed"}
              className="h-14 rounded-2xl bg-gradient-to-r from-neon-green to-neon-blue text-base font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
            >
              {phase === "idle" ? "Place Bet & Fly" : "Next round…"}
            </button>
          )}

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            The longer you wait, the higher the multiplier — but cash out before the plane flies away or you lose your stake.
          </p>
        </>
      }
    />
  )
}
