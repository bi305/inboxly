'use client'

import React, { useMemo } from 'react'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'

const initialNodes = [
  {
    id: 'trigger-1',
    data: { label: 'Trigger: contains “pricing”' },
    position: { x: 0, y: 0 },
    type: 'input'
  },
  {
    id: 'action-1',
    data: { label: 'Action: send text' },
    position: { x: 0, y: 140 }
  }
]

const initialEdges = [{ id: 'e1-2', source: 'trigger-1', target: 'action-1' }]

export function FlowCanvas() {
  const nodes = useMemo(() => initialNodes, [])
  const edges = useMemo(() => initialEdges, [])

  return (
    <div className="h-[420px] rounded-2xl border border-neutral-200 bg-white">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
}
