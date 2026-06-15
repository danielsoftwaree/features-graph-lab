import { Handle, Position, type NodeProps } from '@xyflow/react'
import { cn } from '@/shared/lib/cn'

interface CustomNodeData {
  label: string
  isCritical?: boolean
  isMissing?: boolean
  onClick?: () => void
}

export function CustomNode({ data }: NodeProps) {
  const { label, isCritical, isMissing, onClick } = data as CustomNodeData

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg border px-4 py-2 text-sm font-medium shadow-md transition-all',
        isMissing
          ? 'border-dashed border-destructive bg-destructive-surface text-destructive'
          : isCritical
            ? 'border-warning bg-warning-surface text-warning'
            : 'border-border bg-muted text-foreground',
      )}
    >
      <Handle type="target" position={Position.Left} />
      {label}
      <Handle type="source" position={Position.Right} />
    </button>
  )
}
