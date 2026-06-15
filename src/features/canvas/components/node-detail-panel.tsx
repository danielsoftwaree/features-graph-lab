import type { Node } from '@xyflow/react'

interface NodeDetailPanelProps {
  node: Node | null
  onClose: () => void
}

export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  if (!node) return null

  return (
    <div className="absolute right-4 top-4 z-10 w-72 rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-100">{String(node.data.label)}</span>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-300"
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>
      <p className="text-xs leading-relaxed text-zinc-400">
        Select a node to see details about this step in the pipeline.
      </p>
    </div>
  )
}
