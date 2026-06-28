"use client"

import type { ReactNode } from "react"

export function GameFrame({
  stage,
  controls,
}: {
  stage: ReactNode
  controls: ReactNode
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <div className="glass relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-border/80 p-6 shadow-[0_28px_80px_-48px_rgb(0_0_0_/_0.9)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        {stage}
      </div>
      <div className="glass flex flex-col gap-4 rounded-[2rem] border border-border/80 p-5 shadow-[0_28px_80px_-48px_rgb(0_0_0_/_0.9)]">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Bet desk</span>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
            Live
          </span>
        </div>
        {controls}
      </div>
    </div>
  )
}
