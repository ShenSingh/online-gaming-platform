"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight, Trophy, Wallet, Flame, ChevronRight } from "lucide-react"
import { usePlatform } from "@/components/providers/platform-provider"
import { WalletModal } from "@/components/wallet/wallet-modal"
import { StatCard } from "@/components/ui/stat-card"
import { TransactionList } from "@/components/wallet/transaction-list"
import { GameCard } from "@/components/games/game-card"
import { GAMES } from "@/lib/games"
import { usd } from "@/lib/format"

export function DashboardView() {
  const { user, balance, transactions } = usePlatform()
  const [modal, setModal] = useState<null | "deposit" | "withdraw">(null)

  const { wins, wagered } = useMemo(() => {
    const wins = transactions.filter((t) => t.type === "win").reduce((s, t) => s + t.amount, 0)
    const wagered = transactions.filter((t) => t.type === "bet").reduce((s, t) => s + Math.abs(t.amount), 0)
    return { wins, wagered }
  }, [transactions])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-gradient-to-br from-neon-green/10 via-card to-card p-6 shadow-[0_28px_90px_-56px_rgb(0_0_0_/_0.95)]"
        >
          <div className="absolute -right-10 -bottom-10 size-56 rounded-full bg-neon-green/10 blur-3xl" />
          <Wallet className="absolute -right-4 -bottom-4 size-44 text-primary/10" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Control room
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Welcome back,</p>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{user?.name}</h1>
                <p className="mt-2 text-sm text-muted-foreground">Your wallet and live session summary</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/45 px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Status</p>
                <p className="mt-1 text-sm font-semibold text-foreground">Demo live</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Wallet</p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-neon-green text-glow-green">
                  {usd(balance)}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Wins</p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{usd(wins)}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Wagered</p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{usd(wagered)}</p>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap gap-2.5 pt-6">
              <button
                onClick={() => setModal("deposit")}
                className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-neon-green to-neon-blue px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <ArrowDownLeft className="size-4" /> Deposit
              </button>
              <button
                onClick={() => setModal("withdraw")}
                className="flex items-center gap-1.5 rounded-2xl border border-border/70 bg-background/45 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <ArrowUpRight className="size-4" /> Withdraw
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <StatCard icon={Trophy} label="Total winnings" value={usd(wins)} accent="green" delay={0.05} />
          <StatCard icon={Flame} label="Total wagered" value={usd(wagered)} accent="purple" delay={0.1} />
        </div>
      </div>

      {/* Featured games */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Featured games</h2>
          <Link
            href="/games"
            className="flex items-center gap-1 text-sm font-medium text-neon-blue hover:underline"
          >
            View all <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {GAMES.map((g, i) => (
            <GameCard key={g.key} game={g} delay={i * 0.05} />
          ))}
        </div>
      </section>

      {/* Recent transactions */}
      <section className="glass rounded-2xl border border-border p-5">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Recent activity</h2>
          <Link href="/wallet" className="text-sm font-medium text-neon-blue hover:underline">
            See all
          </Link>
        </div>
        <TransactionList items={transactions} limit={5} />
      </section>

      <WalletModal open={modal === "deposit"} onClose={() => setModal(null)} mode="deposit" />
      <WalletModal open={modal === "withdraw"} onClose={() => setModal(null)} mode="withdraw" />
    </div>
  )
}
