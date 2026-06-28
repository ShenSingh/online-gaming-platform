"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Dices, ShieldCheck, Sparkles, TrendingUp, Users, Wallet, Zap } from "lucide-react"
import { usePlatform } from "@/components/providers/platform-provider"
import { AuthForm } from "@/components/auth/auth-form"
import type { PointerEvent as ReactPointerEvent } from "react"

const features = [
  {
    icon: Zap,
    title: "Fast cashouts",
    text: "Move from lobby to wallet without waiting around.",
  },
  {
    icon: ShieldCheck,
    title: "Fair play",
    text: "Transparent game logic and a cleaner, calmer UI.",
  },
  {
    icon: TrendingUp,
    title: "Live action",
    text: "See the table mood shift with every round.",
  },
]

const stats = [
  { icon: Users, label: "Players online", value: "12.4k" },
  { icon: Wallet, label: "Avg. cashout", value: "< 30s" },
  { icon: Sparkles, label: "Tables live", value: "4" },
]

export default function AuthPage() {
  const { user } = usePlatform()
  const router = useRouter()
  const [cursor, setCursor] = useState({ x: 0.52, y: 0.38 })
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (user) router.replace(user.role === "admin" ? "/admin" : "/dashboard")
  }, [user, router])

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const { clientX, clientY, currentTarget } = event
    const rect = currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    setHovering(true)
    setCursor({
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    })
  }

  function resetCursor() {
    setHovering(false)
    setCursor({ x: 0.52, y: 0.38 })
  }

  const backgroundTransform = {
    transform: `translate3d(${(cursor.x - 0.5) * 34}px, ${(cursor.y - 0.5) * 24}px, 0) scale(1.14)`,
    transition: hovering ? "transform 120ms ease-out" : "transform 360ms ease-out",
  }

  const glowTransform = {
    transform: `translate3d(${(cursor.x - 0.5) * -42}px, ${(cursor.y - 0.5) * -30}px, 0)`,
    transition: hovering ? "transform 120ms ease-out" : "transform 360ms ease-out",
  }

  return (
    <div
      className="relative h-dvh overflow-hidden bg-background"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetCursor}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/auth-hero.png"
          alt="Neon casino games"
          fill
          priority
          className="object-cover opacity-45 saturate-125 contrast-110"
          style={backgroundTransform}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(90,214,255,0.26),transparent_26%),radial-gradient(circle_at_82%_10%,rgba(176,96,255,0.22),transparent_24%),radial-gradient(circle_at_50%_88%,rgba(90,214,255,0.12),transparent_28%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/92 via-background/72 to-background/86 lg:from-background/84 lg:via-background/46 lg:to-background/84" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/30" />
        <div
          className="absolute -left-20 top-[-6rem] size-[28rem] rounded-full bg-neon-blue/12 blur-3xl"
          style={glowTransform}
        />
        <div
          className="absolute right-[-8rem] top-[18%] size-[24rem] rounded-full bg-neon-purple/14 blur-3xl"
          style={glowTransform}
        />
      </div>

      <div className="relative z-10 grid h-full min-h-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden h-full min-h-0 items-center px-8 py-8 lg:flex xl:px-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-neon-green to-neon-blue text-primary-foreground shadow-[0_20px_40px_-20px_rgb(90_214_255_/_0.9)]">
                <Dices className="size-5" />
              </span>
              <div>
                <span className="block text-xl font-bold tracking-tight">
                  Nova<span className="text-neon-green text-glow-green">Bet</span>
                </span>
                <span className="block text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  Premium gaming cockpit
                </span>
              </div>
            </div>

            <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <Sparkles className="size-3.5 text-neon-green" />
              Welcome to the new lobby
            </div>
            <h1 className="mt-5 max-w-lg text-balance text-4xl font-bold leading-[0.95] text-foreground xl:text-5xl">
              Arcade-grade betting, wrapped in a calmer control room.
            </h1>
            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
              Dice, crash, roulette and slots now sit inside a sharper visual system with richer
              surfaces, brighter feedback and a more editorial feel.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3.5 py-2 text-xs font-medium text-foreground"
                  >
                    <Icon className="size-3.5 text-neon-green" />
                    {feature.title}
                  </div>
                )
              })}
            </div>

            <div className="mt-5 grid max-w-lg gap-3 sm:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="rounded-2xl border border-border/70 bg-card/70 p-3.5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      <Icon className="size-3.5 text-neon-green" />
                      {stat.label}
                    </div>
                    <p className="mt-2 text-lg font-bold tabular-nums text-foreground">{stat.value}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full border border-border/70 bg-background/35 px-3 py-1.5">
                Better spacing
              </span>
              <span className="rounded-full border border-border/70 bg-background/35 px-3 py-1.5">
                Stronger contrast
              </span>
              <span className="rounded-full border border-border/70 bg-background/35 px-3 py-1.5">
                Faster cues
              </span>
            </div>
          </motion.div>
        </div>

        <div className="flex h-full items-center justify-center px-5 py-4 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-neon-green to-neon-blue text-primary-foreground shadow-[0_20px_40px_-20px_rgb(90_214_255_/_0.9)]">
                  <Dices className="size-5" />
                </span>
                <span className="text-lg font-bold tracking-tight">
                  Nova<span className="text-neon-green">Bet</span>
                </span>
              </div>
              <span className="rounded-full border border-border/70 bg-background/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Live tables
              </span>
            </div>
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  )
}
