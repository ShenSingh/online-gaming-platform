"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Menu, Plus, Wallet } from "lucide-react"
import { usePlatform } from "@/components/providers/platform-provider"
import { WalletModal } from "@/components/wallet/wallet-modal"
import { usd } from "@/lib/format"

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { user, balance, logout } = usePlatform()
  const router = useRouter()
  const [walletOpen, setWalletOpen] = useState(false)

  function handleLogout() {
    logout()
    router.push("/")
  }

  const initials = user?.name?.slice(0, 2).toUpperCase() ?? "NB"

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/60 px-3 py-3 backdrop-blur-2xl lg:px-6">
      <div className="flex h-16 items-center gap-3 rounded-3xl border border-border/70 bg-card/70 px-3.5 shadow-[0_20px_70px_-48px_rgb(0_0_0_/_0.95)] sm:px-4">
        <button
          onClick={onMenu}
          className="grid size-10 place-items-center rounded-2xl border border-border/70 bg-background/50 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-6" />
        </button>

        <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground sm:flex">
          <span className="size-2 rounded-full bg-neon-green glow-green" />
          Live demo
        </div>

        <div className="hidden items-center gap-2 rounded-2xl border border-border/70 bg-background/40 px-3.5 py-2 sm:flex">
          <Wallet className="size-4 text-neon-green" />
          <div className="leading-tight">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Wallet</p>
            <span className="text-sm font-semibold tabular-nums text-foreground">{usd(balance)}</span>
          </div>
        </div>

        <div className="flex-1" />

        <button
          onClick={() => setWalletOpen(true)}
          className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-neon-green to-neon-blue px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Deposit</span>
        </button>

        <button
          className="relative grid size-10 place-items-center rounded-2xl border border-border/70 bg-background/40 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-neon-purple" />
        </button>

        <div className="hidden items-center gap-2 rounded-2xl border border-border/70 bg-background/40 py-1.5 pl-1.5 pr-2 md:flex">
          <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-neon-purple/30 to-neon-blue/20 text-xs font-bold text-foreground">
            {initials}
          </span>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-foreground">{user?.name}</p>
            <p className="text-[10px] capitalize text-muted-foreground">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="grid size-10 place-items-center rounded-2xl border border-border/70 bg-background/40 text-muted-foreground transition-colors hover:text-lose"
          aria-label="Log out"
        >
          <LogOut className="size-4" />
        </button>
      </div>

      <WalletModal open={walletOpen} onClose={() => setWalletOpen(false)} mode="deposit" />
    </header>
  )
}
