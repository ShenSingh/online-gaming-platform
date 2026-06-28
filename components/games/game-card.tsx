"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users, Play } from "lucide-react"
import type { GameInfo } from "@/lib/games"
import { accentText, accentGlow } from "@/lib/games"
import { cn } from "@/lib/utils"

export function GameCard({ game, delay = 0 }: { game: GameInfo; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Link
        href={`/games?play=${game.key}`}
        className="group block overflow-hidden rounded-[1.75rem] border border-border/80 bg-card/80 shadow-[0_24px_80px_-52px_rgb(0_0_0_/_0.95)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={game.image || "/placeholder.svg"}
            alt={game.label}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-border/70 bg-background/75 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
            <Users className="size-3" /> {game.players}
          </span>
          <span className="absolute right-3 top-3 rounded-full border border-border/70 bg-background/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
            Live
          </span>
          <span
            className={cn(
              "absolute right-3 bottom-3 grid size-10 translate-y-2 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
              accentGlow[game.accent],
            )}
          >
            <Play className="size-4 fill-current" />
          </span>
        </div>
        <div className="p-4">
          <h3 className={cn("font-semibold", accentText[game.accent])}>{game.label}</h3>
          <p className="mt-0.5 text-pretty text-xs leading-relaxed text-muted-foreground">{game.tagline}</p>
        </div>
      </Link>
    </motion.div>
  )
}
