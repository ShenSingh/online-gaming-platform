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

function Reel({ index, spinning, delay }: { index: number; spinning: boolean; delay: number }) {
  const Sym = SYMBOLS[index].icon
  return (
    <div className="grid h-24 w-20 place-items-center overflow-hidden rounded-xl border border-border bg-card sm:h-28 sm:w-24">
      <motion.div
        key={spinning ? `spin-${delay}` : `rest-${index}`}
        animate={spinning ? { y: [0, -240, 0] } : { y: 0 }}
        transition={spinning ? { repeat: Infinity, duration: 0.4, delay } : { type: "spring", stiffness: 300 }}
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

  function spin() {
    if (spinning) return
    if (amount <= 0) return pushToast({ title: "Enter a bet amount", variant: "error" })
    if (amount > balance) return pushToast({ title: "Insufficient balance", variant: "error" })

    setSpinning(true)
    setLastWin(null)
    const final = [randomReel(), randomReel(), randomReel()]

    setTimeout(() => {
      setReels(final)
      let mult = 0
      if (final[0] === final[1] && final[1] === final[2]) {
        mult = SYMBOLS[final[0]].pay
      } else if (final[0] === final[1] || final[1] === final[2] || final[0] === final[2]) {
        mult = 1.5
      }
      const payout = Math.round(amount * mult)
      settleBet({ game: "slots", label: "Slots", stake: amount, payout })
      setLastWin(payout)
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
          <div className="flex gap-3">
            {reels.map((r, i) => (
              <Reel key={i} index={r} spinning={spinning} delay={i * 0.1} />
            ))}
          </div>
          {lastWin !== null && !spinning && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn("mt-6 text-xl font-bold", lastWin > 0 ? "text-neon-green text-glow-green" : "text-muted-foreground")}
            >
              {lastWin > 0 ? `+$${lastWin.toLocaleString()}` : "Try again"}
            </motion.p>
          )}
          {lastWin === null && !spinning && (
            <p className="mt-6 text-sm text-muted-foreground">Match 3 symbols for the jackpot</p>
          )}
        </>
      }
      controls={
        <>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Paytable (3 of a kind)</p>
            <div className="grid grid-cols-3 gap-2">
              {SYMBOLS.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.id} className="flex items-center gap-1.5">
                    <Icon className={cn("size-4", s.color)} />
                    <span className="text-xs font-semibold text-foreground">{s.pay}×</span>
                  </div>
                )
              })}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Any 2 matching pays 1.5×</p>
          </div>

          <BetInput amount={amount} setAmount={setAmount} balance={balance} disabled={spinning} />

          <button
            onClick={spin}
            disabled={spinning}
            className="h-14 rounded-xl bg-primary text-base font-bold text-primary-foreground transition-all hover:opacity-90 glow-green disabled:opacity-50"
          >
            {spinning ? "Spinning…" : "Spin Reels"}
          </button>
        </>
      }
    />
  )
}
