"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, Sparkles, User } from "lucide-react"
import { usePlatform } from "@/components/providers/platform-provider"
import { cn } from "@/lib/utils"

function Field({
  icon: Icon,
  ...props
}: { icon: typeof Mail } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon className="absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground" />
      <input
        {...props}
        className="h-12 w-full rounded-xl border border-input bg-input/40 pr-3.5 pl-11 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/25"
      />
    </div>
  )
}

const socials = [
  { id: "google", label: "Google" },
  { id: "apple", label: "Apple" },
  { id: "discord", label: "Discord" },
]

export function AuthForm() {
  const router = useRouter()
  const { login, pushToast } = usePlatform()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [showPwd, setShowPwd] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const isRegister = mode === "register"

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password || (isRegister && !name)) {
      pushToast({ title: "Please fill in all fields", variant: "error" })
      return
    }
    login(email, isRegister ? name : undefined)
    pushToast({
      title: isRegister ? "Account created" : "Welcome back",
      description: "Redirecting to your dashboard",
      variant: "success",
    })
    router.push("/dashboard")
  }

  function quickPlay(asAdmin: boolean) {
    login(asAdmin ? "admin@novabet.gg" : "player@novabet.gg")
    router.push(asAdmin ? "/admin" : "/dashboard")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass w-full max-w-md overflow-hidden rounded-[2rem] border border-border/80 p-6 shadow-[0_30px_90px_-52px_rgb(0_0_0_/_0.95)] sm:p-7"
    >
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          <Sparkles className="size-3.5 text-neon-green" />
          Instant demo access
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Step into the lobby</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Use a player or admin demo account to explore the platform in seconds.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border/70 bg-background/45 p-1 mb-5 text-center text-xs font-medium text-muted-foreground">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "relative flex h-12 items-center justify-center rounded-[1.1rem] text-sm font-semibold capitalize leading-none transition-colors",
              mode === m ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {mode === m && (
              <motion.span
                layoutId="auth-tab"
                className="absolute inset-0 rounded-[1.1rem] bg-gradient-to-r from-neon-green to-neon-blue shadow-[0_16px_34px_-18px_rgb(90_214_255_/_0.85)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{m === "login" ? "Sign in" : "Sign up"}</span>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        {isRegister && (
          <Field
            icon={User}
            type="text"
            placeholder="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        )}
        <Field
          icon={Mail}
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <div className="relative">
          <Lock className="absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? "new-password" : "current-password"}
            className="h-12 w-full rounded-xl border border-input bg-input/40 pr-11 pl-11 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/25"
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPwd ? "Hide password" : "Show password"}
          >
            {showPwd ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>

        {!isRegister && (
          <button type="button" className="self-end text-xs font-medium text-neon-blue hover:underline">
            Forgot password?
          </button>
        )}

        <button
          type="submit"
          className="mt-1 h-12 rounded-2xl bg-gradient-to-r from-neon-green to-neon-blue text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          {isRegister ? "Create account" : "Sign in"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or continue with
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {socials.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => quickPlay(false)}
            className="rounded-2xl border border-border/70 bg-background/45 py-2.5 text-xs font-medium text-foreground transition-colors hover:-translate-y-0.5 hover:bg-accent"
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-dashed border-border/70 bg-background/35 p-3 text-center">
        <p className="text-[11px] text-muted-foreground">Try the demo instantly</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => quickPlay(false)}
            className="rounded-2xl bg-neon-blue/15 py-2 text-xs font-semibold text-neon-blue transition-colors hover:bg-neon-blue/25"
          >
            Enter as Player
          </button>
          <button
            type="button"
            onClick={() => quickPlay(true)}
            className="rounded-2xl bg-neon-purple/15 py-2 text-xs font-semibold text-neon-purple transition-colors hover:bg-neon-purple/25"
          >
            Enter as Admin
          </button>
        </div>
      </div>
    </motion.div>
  )
}
