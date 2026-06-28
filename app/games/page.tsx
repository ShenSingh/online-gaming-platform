import { AppShell } from "@/components/layout/app-shell"
import { GamesView } from "@/components/games/games-view"

type GameId = "dice" | "aviator" | "roulette" | "slots"

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string }>
}) {
  const { game } = await searchParams
  const valid: GameId[] = ["dice", "aviator", "roulette", "slots"]
  const initial = valid.includes(game as GameId) ? (game as GameId) : undefined

  return (
    <AppShell>
      <GamesView initial={initial} />
    </AppShell>
  )
}
