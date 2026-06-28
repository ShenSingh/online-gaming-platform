"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Cherry, Crown, Diamond, Gem, Grape, Star } from "lucide-react"
import { usePlatform } from "@/components/providers/platform-provider"
import { BetInput } from "@/components/games/bet-input"
import { GameFrame } from "@/components/games/game-frame"
import { cn } from "@/lib/utils"

const SYMBOLS = [
  { id: "cherry", icon: Cherry, color: "text-lose", pay: 3 },
  { id: "grape", icon: Grape, color: "text-neon-purple", pay: 4 },
  { id: "star", icon: Star, color: "text-neon-blue", pay: 6 },
  { id: "diamond", icon: Diamond, color: "text-neon-blue", pay: 10 },
  { id: "gem", icon: Gem, color: "text-neon-green", pay: 15 },
  { id: "crown", icon: Crown, color: "text-neon-green", pay: 25 },
]

function randomReel() {
  return Math.floor(Math.random() * SYMBOLS.length)
}

function Reel({
  index,
  spinning,
  delay,
  highlight,
}: {
  index: number
  spinning: boolean
  delay: number
  highlight?: boolean
}) {
  const Sym = SYMBOLS[index].icon
  return (
    <div
      className={cn(
        "grid h-24 w-20 place-items-center overflow-hidden rounded-2xl border bg-card sm:h-28 sm:w-24",
        highlight
          ? "border-neon-green/40 bg-neon-green/10 shadow-[0_18px_34px_-22px_rgb(90_214_255_/_0.85)]"
          : "border-border/70",
      )}
    >
      <motion.div
        key={spinning ? `spin-${delay}` : `rest-${index}`}
        animate={spinning ? { y: [0, -240, 0], scale: [1, 1.04, 1] } : { y: 0, scale: 1 }}
        transition={
          spinning
            ? { repeat: Infinity, duration: 0.45, delay }
            : { type: "spring", stiffness: 300, damping: 24 }
        }
      >
        <Sym className={cn("size-12", SYMBOLS[index].color)} />
      </motion.div>
    </div>
  )
}

export function SlotsGame() {
  const { balance, settleBet, pushToast } = usePlatform()
  const [amount, setAmount] = useState(50)
  const [reels, setReels] = useState([0, 2, 4])
  const [spinning, setSpinning] = useState(false)
  const [lastWin, setLastWin] = useState<number | null>(null)
  const [lastMultiplier, setLastMultiplier] = useState(0)
  const [highlight, setHighlight] = useState<number[]>([])
  const [history, setHistory] = useState<number[]>([0, 1.5, 0, 3, 0])
  const topMultiplier = SYMBOLS[SYMBOLS.length - 1].pay

  function spin() {
    if (spinning) return
    if (amount <= 0) return pushToast({ title: "Enter a bet amount", variant: "error" })
    if (amount > balance) return pushToast({ title: "Insufficient balance", variant: "error" })

    setSpinning(true)
    setLastWin(null)
    setHighlight([])
    const final = [randomReel(), randomReel(), randomReel()]

    setTimeout(() => {
      setReels(final)
      let mult = 0
      let matched: number[] = []
      if (final[0] === final[1] && final[1] === final[2]) {
        mult = SYMBOLS[final[0]].pay
        matched = [0, 1, 2]
      } else if (final[0] === final[1] || final[1] === final[2] || final[0] === final[2]) {
        mult = 1.5
        matched =
          final[0] === final[1]
            ? [0, 1]
            : final[1] === final[2]
              ? [1, 2]
              : [0, 2]
      }
      const payout = Math.round(amount * mult)
      settleBet({ game: "slots", label: "Slots", stake: amount, payout })
      setLastWin(payout)
      setLastMultiplier(mult)
      setHighlight(matched)
      setHistory((prev) => [mult, ...prev].slice(0, 5))
      setSpinning(false)
      pushToast({
        title: payout > 0 ? `You won $${payout.toLocaleString()}!` : "No match",
        description: payout > 0 ? `${mult}× multiplier` : "Spin again",
        variant: payout > 0 ? "success" : "error",
      })
    }, 1200)
  }

  return (
    <GameFrame
      stage={
        <>
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
            <div className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
              Recent hits
            </div>
            <div className="flex flex-wrap justify-end gap-1.5">
              {history.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums",
                    item >= 3
                      ? "bg-neon-green/15 text-neon-green"
                      : item > 0
                        ? "bg-neon-blue/15 text-neon-blue"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {item === 0 ? "0x" : `${item}x`}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {reels.map((r, i) => (
              <Reel key={i} index={r} spinning={spinning} delay={i * 0.1} highlight={highlight.includes(i)} />
            ))}
          </div>
          <div className="mt-5 flex flex-col items-center gap-2">
            <div className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
              {spinning ? "Reels spinning" : lastWin !== null ? "Round complete" : "Ready to spin"}
            </div>
            {lastWin !== null && !spinning && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "text-xl font-bold",
                  lastWin > 0 ? "text-neon-green text-glow-green" : "text-muted-foreground",
                )}
              >
                {lastWin > 0 ? `+$${lastWin.toLocaleString()}` : "Try again"}
              </motion.p>
            )}
            {lastWin === null && !spinning && (
              <p className="text-sm text-muted-foreground">Match 3 symbols for the jackpot</p>
            )}
          </div>
        </>
      }
      controls={
        <>
          <div className="rounded-2xl border border-border/70 bg-background/45 p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Paytable
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SYMBOLS.map((s) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-2 py-1.5"
                  >
                    <Icon className={cn("size-4", s.color)} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold capitalize text-foreground">{s.id}</p>
                      <p className="text-[10px] text-muted-foreground">{s.pay}×</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Any 2 matching pays 1.5×</p>
          </div>

          <BetInput amount={amount} setAmount={setAmount} balance={balance} disabled={spinning} />

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-border/70 bg-background/45 px-3 py-2 text-sm">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Last multiplier
              </span>
              <span className="mt-1 block font-bold text-neon-green">
                {lastMultiplier > 0 ? `${lastMultiplier}x` : "0x"}
              </span>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/45 px-3 py-2 text-sm">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Top payout</span>
              <span className="mt-1 block font-bold text-foreground">
                ${Math.round(amount * topMultiplier).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={spin}
            disabled={spinning}
            className="h-14 rounded-2xl bg-gradient-to-r from-neon-green to-neon-blue text-base font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
          >
            {spinning ? "Spinning…" : "Spin Reels"}
          </button>
        </>
      }
    />
  )
}
