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
          ? 'border-dashed border-red-500 bg-red-950 text-red-400'
          : isCritical
            ? 'border-yellow-500 bg-yellow-950 text-yellow-300'
            : 'border-zinc-600 bg-zinc-800 text-zinc-100',
      )}
    >
      <Handle type="target" position={Position.Left} />
      {label}
      <Handle type="source" position={Position.Right} />
    </button>
  )
}
