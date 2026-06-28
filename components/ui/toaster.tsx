"use client"

import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, X, XCircle, Info } from "lucide-react"
import { usePlatform } from "@/components/providers/platform-provider"

const icons = {
  success: CheckCircle2,
  error: XCircle,
  default: Info,
}

const accents = {
  success: "text-neon-green",
  error: "text-lose",
  default: "text-neon-blue",
}

export function Toaster() {
  const { toasts, dismissToast } = usePlatform()

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.variant]
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="glass pointer-events-auto flex items-start gap-3 rounded-xl border border-border p-3.5 shadow-lg"
            >
              <Icon className={`mt-0.5 size-5 shrink-0 ${accents[t.variant]}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>}
              </div>
              <button
                onClick={() => dismissToast(t.id)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Dismiss notification"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
