"use client"

import { useState } from "react"
import { CreditCard, Bitcoin, Landmark } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { usePlatform } from "@/components/providers/platform-provider"
import { usd } from "@/lib/format"
import { cn } from "@/lib/utils"

const methods = [
  { id: "Card", label: "Card", icon: CreditCard },
  { id: "Crypto", label: "Crypto", icon: Bitcoin },
  { id: "Bank", label: "Bank", icon: Landmark },
]

const quick = [50, 100, 250, 500]

export function WalletModal({
  open,
  onClose,
  mode,
}: {
  open: boolean
  onClose: () => void
  mode: "deposit" | "withdraw"
}) {
  const { balance, deposit, withdraw } = usePlatform()
  const [amount, setAmount] = useState("100")
  const [method, setMethod] = useState("Card")

  const value = Number(amount) || 0
  const isDeposit = mode === "deposit"
  const invalid = value <= 0 || (!isDeposit && value > balance)

  function submit() {
    if (invalid) return
    if (isDeposit) deposit(value, method)
    else withdraw(value, method)
    onClose()
    setAmount("100")
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isDeposit ? "Deposit funds" : "Withdraw funds"}
      description={`Available balance: ${usd(balance)}`}
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-2">
          {methods.map((m) => {
            const Icon = m.icon
            const active = method === m.id
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-all",
                  active
                    ? "border-primary/50 bg-primary/10 text-neon-green"
                    : "border-border text-muted-foreground hover:bg-accent",
                )}
              >
                <Icon className="size-5" />
                {m.label}
              </button>
            )
          })}
        </div>

        <div>
          <label htmlFor="wallet-amount" className="mb-1.5 block text-sm font-medium text-foreground">
            Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">$</span>
            <input
              id="wallet-amount"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-input/40 pr-3 pl-7 text-base font-semibold text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
            />
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => setAmount(String(q))}
                className="rounded-lg border border-border py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                ${q}
              </button>
            ))}
          </div>
        </div>

        {!isDeposit && value > balance && (
          <p className="text-xs text-lose">Amount exceeds your available balance.</p>
        )}

        <button
          onClick={submit}
          disabled={invalid}
          className={cn(
            "h-11 rounded-xl text-sm font-semibold transition-all disabled:opacity-40",
            isDeposit
              ? "bg-primary text-primary-foreground hover:opacity-90 glow-green"
              : "bg-neon-blue text-background hover:opacity-90 glow-blue",
          )}
        >
          {isDeposit ? `Deposit ${usd(value)}` : `Withdraw ${usd(value)}`}
        </button>
        <p className="text-center text-[11px] text-muted-foreground">
          Demo only — no real payment is processed.
        </p>
      </div>
    </Modal>
  )
}
