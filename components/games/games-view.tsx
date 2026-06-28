"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GAMES } from "@/lib/games"
import { DiceGame } from "./dice-game"
import { AviatorGame } from "./aviator-game"
import { RouletteGame } from "./roulette-game"
import { SlotsGame } from "./slots-game"
import { cn } from "@/lib/utils"

type GameId = "dice" | "aviator" | "roulette" | "slots"

export function GamesView({ initial }: { initial?: GameId }) {
  const initialActive = initial ?? "dice"
  const [active, setActive] = useState<GameId>(initialActive)

  useEffect(() => {
    setActive(initialActive)
  }, [initialActive])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-gradient-to-br from-neon-blue/10 via-card to-card p-6 shadow-[0_28px_90px_-56px_rgb(0_0_0_/_0.95)]"
      >
        <div className="absolute -right-10 -top-10 size-52 rounded-full bg-neon-blue/10 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Game lobby
          </div>
          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Pick a table, place a bet, and keep the momentum moving.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            The lobby now sits inside a cleaner control room with more contrast, better rhythm and
            the same virtual-credit flow.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-border/70 bg-background/45 px-3 py-1.5 text-xs font-medium text-foreground">
              4 live tables
            </span>
            <span className="rounded-full border border-border/70 bg-background/45 px-3 py-1.5 text-xs font-medium text-foreground">
              Virtual credits
            </span>
            <span className="rounded-full border border-border/70 bg-background/45 px-3 py-1.5 text-xs font-medium text-foreground">
              Instant rounds
            </span>
          </div>
        </div>
      </motion.div>

      <div className="rounded-[1.75rem] border border-border/70 bg-card/60 p-2 shadow-[0_20px_60px_-44px_rgb(0_0_0_/_0.95)] backdrop-blur">
        {GAMES.map((g) => {
          const isActive = g.key === active
          return (
            <button
              key={g.key}
              type="button"
              onClick={() => setActive(g.key as GameId)}
              className={cn(
                "mr-2 mb-2 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                isActive
                  ? "border-transparent bg-gradient-to-r from-neon-green/20 to-neon-blue/20 text-foreground shadow-[0_16px_30px_-20px_rgb(90_214_255_/_0.8)]"
                  : "border-border/70 bg-background/45 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: g.accent }}
                aria-hidden
              />
              {g.label}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {active === "dice" && <DiceGame />}
          {active === "aviator" && <AviatorGame />}
          {active === "roulette" && <RouletteGame />}
          {active === "slots" && <SlotsGame />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
