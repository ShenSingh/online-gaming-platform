"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { usePlatform } from "@/components/providers/platform-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"

export function AppShell({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user } = usePlatform()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) router.replace("/")
    else if (adminOnly && user.role !== "admin") router.replace("/dashboard")
  }, [user, adminOnly, router])

  if (!user || (adminOnly && user.role !== "admin")) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-neon-green" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(90,214,255,0.16),_transparent_42%),radial-gradient(circle_at_80%_0%,_rgba(172,101,255,0.12),_transparent_38%),linear-gradient(180deg,_rgba(255,255,255,0.04),_transparent_65%)]"
      />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="relative z-10 lg:pl-64">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
