"use client"

import { useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Dices, ShieldCheck, Sparkles, TrendingUp, Users, Wallet, Zap } from "lucide-react"
import { usePlatform } from "@/components/providers/platform-provider"
import { AuthForm } from "@/components/auth/auth-form"

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

  useEffect(() => {
    if (user) router.replace(user.role === "admin" ? "/admin" : "/dashboard")
  }, [user, router])

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.06fr_0.94fr]">
      <div className="relative hidden overflow-hidden border-r border-border/70 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(90,214,255,0.16),transparent_34%),radial-gradient(circle_at_82%_0%,rgba(176,96,255,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_70%)]" />
        <div className="relative z-10 flex flex-1 flex-col p-8 xl:p-10">
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
              <span className="size-2 rounded-full bg-neon-green glow-green" />
              Live tables
            </div>
          </div>

          <div className="mt-10 grid flex-1 gap-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <Sparkles className="size-3.5 text-neon-green" />
                Welcome to the new lobby
              </div>
              <h1 className="mt-5 text-balance text-5xl font-bold leading-[0.95] text-foreground xl:text-6xl">
                Arcade-grade betting, wrapped in a calmer control room.
              </h1>
              <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
                Dice, crash, roulette and slots now sit inside a sharper visual system with richer
                surfaces, brighter feedback and a more editorial feel.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div key={feature.title} className="glass rounded-2xl border border-border/70 p-4">
                      <Icon className="size-4 text-neon-green" />
                      <h2 className="mt-3 text-sm font-semibold text-foreground">{feature.title}</h2>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{feature.text}</p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="rounded-2xl border border-border/70 bg-card/70 p-4">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        <Icon className="size-3.5 text-neon-green" />
                        {stat.label}
                      </div>
                      <p className="mt-2 text-lg font-bold tabular-nums text-foreground">{stat.value}</p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1.5">
                  <span className="size-2 rounded-full bg-neon-blue" />
                  Better spacing
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1.5">
                  <span className="size-2 rounded-full bg-neon-purple" />
                  Stronger contrast
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1.5">
                  <span className="size-2 rounded-full bg-neon-green" />
                  Faster cues
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 shadow-[0_30px_100px_-56px_rgb(0_0_0_/_0.95)]"
            >
              <Image
                src="/images/auth-hero.png"
                alt="Neon casino games"
                fill
                priority
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/18 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="absolute left-4 top-4 rounded-full border border-border/70 bg-background/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
                Featured lobby
              </div>
              <div className="absolute right-4 top-4 rounded-full border border-border/70 bg-background/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
                Instant updates
              </div>
              <div className="absolute inset-x-4 bottom-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-background/80 p-3 backdrop-blur">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Cashout</p>
                  <p className="mt-1 text-lg font-bold text-foreground">&lt; 30s</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/80 p-3 backdrop-blur">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Uptime</p>
                  <p className="mt-1 text-lg font-bold text-foreground">99.9%</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/80 p-3 backdrop-blur">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Tables</p>
                  <p className="mt-1 text-lg font-bold text-foreground">4 live</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <span className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-neon-green to-neon-blue text-primary-foreground shadow-[0_20px_40px_-20px_rgb(90_214_255_/_0.9)]">
              <Dices className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Nova<span className="text-neon-green">Bet</span>
            </span>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
