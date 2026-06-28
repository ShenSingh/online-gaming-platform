"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const accentMap = {
  green: { text: "text-neon-green", bg: "bg-neon-green/15", line: "from-neon-green/80 via-neon-blue/30 to-transparent" },
  blue: { text: "text-neon-blue", bg: "bg-neon-blue/15", line: "from-neon-blue/80 via-neon-purple/30 to-transparent" },
  purple: { text: "text-neon-purple", bg: "bg-neon-purple/15", line: "from-neon-purple/80 via-neon-green/30 to-transparent" },
  neutral: { text: "text-foreground", bg: "bg-muted", line: "from-white/20 via-white/10 to-transparent" },
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "neutral",
  delay = 0,
}: {
  icon: LucideIcon
  label: string
  value: string
  hint?: string
  accent?: keyof typeof accentMap
  delay?: number
}) {
  const a = accentMap[accent]
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="glass relative overflow-hidden rounded-[1.75rem] border border-border/80 p-5 shadow-[0_24px_70px_-48px_rgb(0_0_0_/_0.9)]"
    >
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", a.line)} />
      <div className={cn("absolute -right-6 -top-6 size-24 rounded-full blur-3xl", a.bg)} />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={cn("grid size-9 place-items-center rounded-lg", a.bg, a.text)}>
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tabular-nums text-foreground">{value}</p>
      {hint && <p className={cn("mt-1 text-xs font-medium", a.text)}>{hint}</p>}
    </motion.div>
  )
}
