import { AppShell } from "@/components/layout/app-shell"
import { GamesView } from "@/components/games/games-view"
import type { GameKey } from "@/lib/types"

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string; play?: string }>
}) {
  const { game, play } = await searchParams
  const valid: GameKey[] = ["dice", "aviator", "roulette", "slots"]
  const selected = game ?? play
  const initial = valid.includes(selected as GameKey) ? (selected as GameKey) : undefined

  return (
    <AppShell>
      <GamesView initial={initial} />
    </AppShell>
  )
}
