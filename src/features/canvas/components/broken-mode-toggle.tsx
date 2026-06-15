import { cn } from '@/shared/lib/cn'

interface BrokenModeToggleProps {
  isBroken: boolean
  onToggle: () => void
}

export function BrokenModeToggle({ isBroken, onToggle }: BrokenModeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'rounded-md px-4 py-2 text-sm font-medium transition-colors',
        isBroken
          ? 'bg-red-600 text-white hover:bg-red-700'
          : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700',
      )}
    >
      {isBroken ? 'Broken Mode ON' : 'Enable Broken Mode'}
    </button>
  )
}
