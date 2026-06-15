'use client'

import { useState, useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { CustomNode } from './custom-node'
import { NodeDetailPanel } from './node-detail-panel'
import { BrokenModeToggle } from './broken-mode-toggle'
import { useBrokenMode } from '../hooks/use-broken-mode'

const NODE_TYPES = { custom: CustomNode }

interface NodeCanvasProps {
  nodes: Node[]
  edges: Edge[]
  criticalNodeId: string
}

export function NodeCanvas({ nodes, edges, criticalNodeId }: NodeCanvasProps) {
  const { isBroken, toggle } = useBrokenMode()
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const enrichedNodes = nodes.map((node) => ({
    ...node,
    type: 'custom',
    data: {
      ...node.data,
      isCritical: node.id === criticalNodeId,
      isMissing: isBroken && node.id === criticalNodeId,
    },
  }))

  const handleNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    setSelectedNode(node)
  }, [])

  return (
    <div className="relative h-full w-full bg-zinc-950">
      <div className="absolute left-4 top-4 z-10">
        <BrokenModeToggle isBroken={isBroken} onToggle={toggle} />
      </div>
      <ReactFlow
        nodes={enrichedNodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodeClick={handleNodeClick}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  )
}
