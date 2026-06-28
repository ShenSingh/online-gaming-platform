"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Activity, DollarSign, Users, Gamepad2, Search } from "lucide-react"
import { usePlatform } from "@/components/providers/platform-provider"
import { StatCard } from "@/components/ui/stat-card"
import { RevenueChart } from "./revenue-chart"
import { GameStatsChart } from "./game-stats-chart"
import { usd, timeAgo } from "@/lib/format"
import { cn } from "@/lib/utils"

export function AdminView() {
  const { adminUsers, gameStats, pushToast } = usePlatform()
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState(adminUsers)

  const totals = useMemo(() => {
    const wagered = gameStats.reduce((a, g) => a + g.wagered, 0)
    const payout = gameStats.reduce((a, g) => a + g.payout, 0)
    const rounds = gameStats.reduce((a, g) => a + g.rounds, 0)
    return { wagered, payout, revenue: wagered - payout, rounds }
  }, [gameStats])

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()),
  )

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u
        const status = u.status === "active" ? "suspended" : "active"
        pushToast({
          title: status === "suspended" ? "User suspended" : "User reinstated",
          description: u.name,
          variant: status === "suspended" ? "error" : "success",
        })
        return { ...u, status }
      }),
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-gradient-to-br from-neon-purple/10 via-card to-card p-6 shadow-[0_28px_90px_-56px_rgb(0_0_0_/_0.95)]"
      >
        <div className="absolute -right-10 -top-10 size-56 rounded-full bg-neon-purple/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Admin cockpit
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Platform command center</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Revenue, player activity and moderation now sit inside a cleaner control surface.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
            <div className="rounded-2xl border border-border/70 bg-background/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Revenue</p>
              <p className="mt-2 text-lg font-bold tabular-nums text-neon-green text-glow-green">
                {usd(totals.revenue)}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Players</p>
              <p className="mt-2 text-lg font-bold tabular-nums text-foreground">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Rounds</p>
              <p className="mt-2 text-lg font-bold tabular-nums text-foreground">{totals.rounds.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Wagered</p>
              <p className="mt-2 text-lg font-bold tabular-nums text-foreground">{usd(totals.wagered)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Gross revenue"
          value={usd(totals.revenue)}
          icon={DollarSign}
          accent="green"
          hint="+12.4% this week"
        />
        <StatCard
          label="Total wagered"
          value={usd(totals.wagered)}
          icon={Activity}
          accent="blue"
          hint="+8.1% this week"
        />
        <StatCard
          label="Active players"
          value={users.filter((u) => u.status === "active").length.toString()}
          icon={Users}
          accent="purple"
        />
        <StatCard
          label="Rounds played"
          value={totals.rounds.toLocaleString()}
          icon={Gamepad2}
          accent="green"
          hint="+5.7% this week"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChart />
        <GameStatsChart stats={gameStats} />
      </div>

      <div className="glass rounded-[2rem] border border-border/80">
        <div className="flex flex-col gap-3 border-b border-border/70 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Player management</h3>
            <p className="text-xs text-muted-foreground">{filtered.length} users</p>
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search players..."
              className="h-10 w-full rounded-2xl border border-border/70 bg-background/45 pr-3 pl-9 text-sm outline-none transition-colors focus:border-ring sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Player</th>
                <th className="px-5 py-3 font-medium">Balance</th>
                <th className="px-5 py-3 font-medium">Total wagered</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/60 last:border-0 hover:bg-accent/40">
                  <td className="px-5 py-3">
                    <div className="font-medium text-foreground">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="px-5 py-3 font-semibold text-foreground">{usd(u.balance)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{usd(u.totalWagered)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{timeAgo(u.joined)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        u.status === "active"
                          ? "bg-primary/10 text-primary"
                          : "bg-destructive/10 text-destructive",
                      )}
                    >
                      <span className={cn("size-1.5 rounded-full", u.status === "active" ? "bg-primary" : "bg-destructive")} />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {u.status === "active" ? "Suspend" : "Reinstate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
