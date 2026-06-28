export type TxType = "deposit" | "withdraw" | "bet" | "win"

export type GameKey = "dice" | "aviator" | "roulette" | "slots"

export interface Transaction {
  id: string
  type: TxType
  amount: number // positive credit, negative debit (in USD)
  label: string
  game?: GameKey
  createdAt: number
}

export interface User {
  id: string
  name: string
  email: string
  role: "player" | "admin"
}

export interface AdminUser {
  id: string
  name: string
  email: string
  balance: number
  status: "active" | "suspended"
  joined: number
  totalWagered: number
}

export interface GameStat {
  game: GameKey
  label: string
  rounds: number
  wagered: number
  payout: number // amount paid to players
}

export interface Toast {
  id: string
  title: string
  description?: string
  variant: "default" | "success" | "error"
}

export const GAME_META: Record<GameKey, { label: string; tag: string; accent: "green" | "blue" | "purple" }> = {
  dice: { label: "Dice", tag: "Roll over / under", accent: "green" },
  aviator: { label: "Aviator", tag: "Cash out before crash", accent: "blue" },
  roulette: { label: "Roulette", tag: "Red, black or number", accent: "purple" },
  slots: { label: "Slots", tag: "Match the reels", accent: "green" },
}
