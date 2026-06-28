"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dices, LayoutDashboard, Wallet, Gamepad2, ShieldCheck, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePlatform } from "@/components/providers/platform-provider"
import { usd } from "@/lib/format"

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/admin", label: "Admin", icon: ShieldCheck, adminOnly: true },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { user, balance } = usePlatform()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-hidden border-r border-border/70 bg-sidebar/95 px-4 py-5 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_10%_0%,_rgba(84,214,255,0.18),_transparent_38%),radial-gradient(circle_at_90%_0%,_rgba(177,91,255,0.18),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.04),_transparent_72%)]"
        />
        <div className="relative mb-8 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-neon-green to-neon-blue text-primary-foreground shadow-[0_20px_40px_-20px_rgb(90_214_255_/_0.9)]">
              <Dices className="size-5" />
            </span>
            <div>
              <span className="block text-lg font-bold tracking-tight">
                Nova<span className="text-neon-green text-glow-green">Bet</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Control room
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="relative flex flex-1 flex-col gap-1">
          {nav
            .filter((item) => !item.adminOnly || user?.role === "admin")
            .map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/")
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-gradient-to-r from-primary/18 via-primary/10 to-transparent text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                      : "text-muted-foreground hover:bg-sidebar-accent/80 hover:text-foreground",
                  )}
                >
                  <Icon className={cn("size-5", active && "text-glow-green")} />
                  {item.label}
                  {active && <span className="ml-auto size-1.5 rounded-full bg-neon-green glow-green" />}
                </Link>
              )
            })}
        </nav>

        <div className="relative mt-4 overflow-hidden rounded-3xl border border-border/70 bg-background/50 p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(172,91,255,0.12),_transparent_42%)]" />
          <div className="relative flex items-center gap-2 text-neon-purple">
            <Sparkles className="size-4" />
            <span className="text-sm font-semibold text-foreground">VIP Club</span>
          </div>
          <p className="relative mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Wager $10k this week to unlock cashback and exclusive tables.
          </p>
          <div className="relative mt-3 rounded-2xl border border-border/70 bg-card/80 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Demo wallet
              </span>
              <span className="rounded-full bg-neon-green/15 px-2 py-0.5 text-[10px] font-semibold text-neon-green">
                Active
              </span>
            </div>
            <p className="mt-2 text-lg font-bold tabular-nums text-foreground">{usd(balance)}</p>
          </div>
        </div>
      </aside>
    </>
  )
}
