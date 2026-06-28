"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import type { AdminUser, GameKey, GameStat, Toast, Transaction, User } from "@/lib/types"

interface BetResult {
  game: GameKey
  label: string
  stake: number
  payout: number // total returned to player (0 on loss, stake*multiplier on win)
}

interface PlatformState {
  user: User | null
  balance: number
  transactions: Transaction[]
  toasts: Toast[]
  adminUsers: AdminUser[]
  gameStats: GameStat[]
  login: (email: string, name?: string) => void
  logout: () => void
  deposit: (amount: number, method: string) => void
  withdraw: (amount: number, method: string) => boolean
  settleBet: (result: BetResult) => void
  pushToast: (t: Omit<Toast, "id">) => void
  dismissToast: (id: string) => void
}

const PlatformContext = createContext<PlatformState | null>(null)

const now = Date.now()
const DAY = 86_400_000

const seedTransactions: Transaction[] = [
  { id: "t1", type: "deposit", amount: 2000, label: "Card deposit", createdAt: now - DAY * 2 },
  { id: "t2", type: "bet", amount: -150, label: "Dice bet", game: "dice", createdAt: now - DAY * 2 + 3600_000 },
  { id: "t3", type: "win", amount: 285, label: "Dice win", game: "dice", createdAt: now - DAY * 2 + 3600_500 },
  { id: "t4", type: "bet", amount: -200, label: "Aviator bet", game: "aviator", createdAt: now - DAY },
  { id: "t5", type: "win", amount: 460, label: "Aviator cash out 2.30x", game: "aviator", createdAt: now - DAY + 1000 },
  { id: "t6", type: "withdraw", amount: -500, label: "Bank withdrawal", createdAt: now - DAY / 2 },
  { id: "t7", type: "bet", amount: -100, label: "Slots bet", game: "slots", createdAt: now - 7200_000 },
]

const seedAdminUsers: AdminUser[] = [
  { id: "u1", name: "Ava Mitchell", email: "ava@novabet.gg", balance: 4820, status: "active", joined: now - DAY * 40, totalWagered: 28400 },
  { id: "u2", name: "Leo Carter", email: "leo@novabet.gg", balance: 1290, status: "active", joined: now - DAY * 26, totalWagered: 14750 },
  { id: "u3", name: "Mia Nguyen", email: "mia@novabet.gg", balance: 9650, status: "active", joined: now - DAY * 18, totalWagered: 52300 },
  { id: "u4", name: "Noah Patel", email: "noah@novabet.gg", balance: 0, status: "suspended", joined: now - DAY * 12, totalWagered: 8100 },
  { id: "u5", name: "Zoe Bauer", email: "zoe@novabet.gg", balance: 2240, status: "active", joined: now - DAY * 5, totalWagered: 6300 },
]

const seedGameStats: GameStat[] = [
  { game: "dice", label: "Dice", rounds: 18420, wagered: 412000, payout: 388400 },
  { game: "aviator", label: "Aviator", rounds: 12980, wagered: 521000, payout: 503600 },
  { game: "roulette", label: "Roulette", rounds: 9610, wagered: 298000, payout: 281200 },
  { game: "slots", label: "Slots", rounds: 22150, wagered: 367000, payout: 334900 },
]

let counter = 0
const uid = (p = "id") => `${p}_${Date.now().toString(36)}_${(counter++).toString(36)}`

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [balance, setBalance] = useState(1635)
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(seedAdminUsers)
  const [gameStats, setGameStats] = useState<GameStat[]>(seedGameStats)

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = uid("toast")
    setToasts((prev) => [...prev, { ...t, id }])
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const addTx = useCallback((tx: Omit<Transaction, "id" | "createdAt">) => {
    setTransactions((prev) => [{ ...tx, id: uid("tx"), createdAt: Date.now() }, ...prev])
  }, [])

  const login = useCallback((email: string, name?: string) => {
    const isAdmin = email.toLowerCase().startsWith("admin")
    setUser({
      id: uid("user"),
      email,
      name: name || email.split("@")[0].replace(/^\w/, (c) => c.toUpperCase()),
      role: isAdmin ? "admin" : "player",
    })
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const deposit = useCallback(
    (amount: number, method: string) => {
      setBalance((b) => b + amount)
      addTx({ type: "deposit", amount, label: `${method} deposit` })
      pushToast({ title: "Deposit successful", description: `$${amount.toLocaleString()} added`, variant: "success" })
    },
    [addTx, pushToast],
  )

  const withdraw = useCallback(
    (amount: number, method: string) => {
      let ok = false
      setBalance((b) => {
        if (amount > b) return b
        ok = true
        return b - amount
      })
      if (ok) {
        addTx({ type: "withdraw", amount: -amount, label: `${method} withdrawal` })
        pushToast({ title: "Withdrawal sent", description: `$${amount.toLocaleString()} on its way`, variant: "success" })
      } else {
        pushToast({ title: "Insufficient balance", variant: "error" })
      }
      return ok
    },
    [addTx, pushToast],
  )

  const settleBet = useCallback(
    ({ game, label, stake, payout }: BetResult) => {
      setBalance((b) => b - stake + payout)
      addTx({ type: "bet", amount: -stake, label: `${label} bet`, game })
      if (payout > 0) {
        addTx({ type: "win", amount: payout, label: `${label} win`, game })
      }
      setGameStats((prev) =>
        prev.map((g) =>
          g.game === game
            ? { ...g, rounds: g.rounds + 1, wagered: g.wagered + stake, payout: g.payout + payout }
            : g,
        ),
      )
    },
    [addTx],
  )

  const value = useMemo<PlatformState>(
    () => ({
      user,
      balance,
      transactions,
      toasts,
      adminUsers,
      gameStats,
      login,
      logout,
      deposit,
      withdraw,
      settleBet,
      pushToast,
      dismissToast,
    }),
    [user, balance, transactions, toasts, adminUsers, gameStats, login, logout, deposit, withdraw, settleBet, pushToast, dismissToast],
  )

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}

export function usePlatform() {
  const ctx = useContext(PlatformContext)
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider")
  return ctx
}
