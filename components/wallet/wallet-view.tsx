"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bitcoin,
  CreditCard,
  Landmark,
  Plus,
  Wallet,
} from "lucide-react"
import { usePlatform } from "@/components/providers/platform-provider"
import { WalletModal } from "@/components/wallet/wallet-modal"
import { TransactionList } from "@/components/wallet/transaction-list"
import { usd } from "@/lib/format"

const paymentMethods = [
  { id: "card", label: "Visa •••• 4829", sub: "Expires 09/27", icon: CreditCard, accent: "text-neon-green" },
  { id: "crypto", label: "Bitcoin Wallet", sub: "bc1q••••k4m2", icon: Bitcoin, accent: "text-neon-blue" },
  { id: "bank", label: "Chase Bank", sub: "Checking ••6601", icon: Landmark, accent: "text-neon-purple" },
]

const filters = ["all", "deposit", "withdraw", "bet", "win"] as const

export function WalletView() {
  const { balance, transactions } = usePlatform()
  const [modal, setModal] = useState<null | "deposit" | "withdraw">(null)
  const [filter, setFilter] = useState<(typeof filters)[number]>("all")

  const { deposited, withdrawn } = useMemo(() => {
    const deposited = transactions.filter((t) => t.type === "deposit").reduce((s, t) => s + t.amount, 0)
    const withdrawn = transactions
      .filter((t) => t.type === "withdraw")
      .reduce((s, t) => s + Math.abs(t.amount), 0)
    return { deposited, withdrawn }
  }, [transactions])

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter)

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-gradient-to-br from-neon-green/10 via-card to-card p-6 shadow-[0_28px_90px_-56px_rgb(0_0_0_/_0.95)]"
      >
        <div className="absolute -right-8 -bottom-8 size-56 rounded-full bg-neon-green/10 blur-3xl" />
        <Wallet className="absolute -right-2 -bottom-2 size-44 text-primary/10" />
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Wallet
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Balance vault</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Manage your balance, deposits and payouts from a sharper wallet experience.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-auto">
            <div className="rounded-2xl border border-border/70 bg-background/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Balance</p>
              <p className="mt-2 text-lg font-bold tabular-nums text-neon-green text-glow-green">
                {usd(balance)}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Deposited</p>
              <p className="mt-2 text-lg font-bold tabular-nums text-foreground">{usd(deposited)}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/45 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Withdrawn</p>
              <p className="mt-2 text-lg font-bold tabular-nums text-foreground">{usd(withdrawn)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-gradient-to-br from-primary/12 via-card to-card p-6 lg:col-span-2"
        >
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="size-4 text-neon-green" /> Current balance
            </div>
            <p className="mt-2 text-4xl font-bold tabular-nums text-neon-green text-glow-green">
              {usd(balance)}
            </p>
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
          <div className="glass rounded-[1.75rem] border border-border/80 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowDownLeft className="size-4 text-neon-green" /> Deposited
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{usd(deposited)}</p>
          </div>
          <div className="glass rounded-[1.75rem] border border-border/80 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowUpRight className="size-4 text-neon-blue" /> Withdrawn
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">{usd(withdrawn)}</p>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-foreground">Payment methods</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {paymentMethods.map((m) => {
            const Icon = m.icon
            return (
              <div
                key={m.id}
                className="glass flex items-center gap-3 rounded-[1.75rem] border border-border/80 p-4"
              >
                <span className={`grid size-10 place-items-center rounded-xl bg-muted ${m.accent}`}>
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.sub}</p>
                </div>
              </div>
            )
          })}
        </div>
        <button className="mt-3 flex items-center gap-1.5 text-sm font-medium text-neon-blue hover:underline">
          <Plus className="size-4" /> Add payment method
        </button>
      </section>

      {/* Transaction history */}
      <section className="glass rounded-[2rem] border border-border/80 p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">Transaction history</h2>
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-gradient-to-r from-neon-green to-neon-blue text-primary-foreground"
                    : "border border-border/70 bg-background/45 text-muted-foreground hover:bg-accent"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <TransactionList items={filtered} />
      </section>

      <WalletModal open={modal === "deposit"} onClose={() => setModal(null)} mode="deposit" />
      <WalletModal open={modal === "withdraw"} onClose={() => setModal(null)} mode="withdraw" />
    </div>
  )
}
