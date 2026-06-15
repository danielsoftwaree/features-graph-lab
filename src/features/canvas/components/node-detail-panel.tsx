import type { Node } from '@xyflow/react'

interface NodeDetailPanelProps {
  node: Node | null
  onClose: () => void
}

export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  if (!node) return null

  return (
    <div className="absolute right-4 top-4 z-10 w-72 rounded-xl border border-border bg-card p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{String(node.data.label)}</span>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Select a node to see details about this step in the pipeline.
      </p>
    </div>
  )
}
