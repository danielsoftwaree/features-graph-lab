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
          ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
          : 'bg-muted text-foreground hover:bg-muted/80',
      )}
    >
      {isBroken ? 'Broken Mode ON' : 'Enable Broken Mode'}
    </button>
  )
}
