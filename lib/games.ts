import type { GameKey } from "@/lib/types"

export interface GameInfo {
  key: GameKey
  label: string
  tagline: string
  image: string
  accent: "green" | "blue" | "purple"
  players: string
}

export const GAMES: GameInfo[] = [
  {
    key: "dice",
    label: "Dice",
    tagline: "Roll over or under and beat the odds",
    image: "/images/game-dice.png",
    accent: "green",
    players: "1.2k",
  },
  {
    key: "aviator",
    label: "Aviator",
    tagline: "Cash out before the plane flies away",
    image: "/images/game-aviator.png",
    accent: "blue",
    players: "3.4k",
  },
  {
    key: "roulette",
    label: "Roulette",
    tagline: "Bet red, black, or a lucky number",
    image: "/images/game-roulette.png",
    accent: "purple",
    players: "890",
  },
  {
    key: "slots",
    label: "Slots",
    tagline: "Spin three reels for big multipliers",
    image: "/images/game-slots.png",
    accent: "green",
    players: "2.1k",
  },
]

export const accentText = {
  green: "text-neon-green",
  blue: "text-neon-blue",
  purple: "text-neon-purple",
}

export const accentGlow = {
  green: "glow-green",
  blue: "glow-blue",
  purple: "glow-purple",
}

export const accentBg = {
  green: "bg-neon-green/15",
  blue: "bg-neon-blue/15",
  purple: "bg-neon-purple/15",
}
