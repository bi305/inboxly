import { FlowDefinition, TriggerNode, ActionNode, FlowEdge } from '@shared'

export class RuntimeEngine {
  execute(flow: FlowDefinition, input: { text?: string; intent?: string }, variables: Record<string, any>) {
    const nodes = new Map<string, TriggerNode | ActionNode>(
      flow.nodes.map((node) => [node.id, node])
    )
    const triggers = flow.nodes.filter((n) => n.type === 'trigger') as TriggerNode[]

    const matched = this.matchTrigger(triggers, input, variables)
    if (!matched) {
      return { actions: [] as ActionNode[] }
    }

    const actions: ActionNode[] = []
    let currentId = matched.id
    const visited = new Set<string>()

    while (true) {
      if (visited.has(currentId)) break
      visited.add(currentId)

      const nextEdges = flow.edges.filter((e) => e.source === currentId)
      if (!nextEdges.length) break

      const nextEdge = this.pickEdge(nextEdges, variables, input)
      if (!nextEdge) break

      currentId = nextEdge.target
      const node = nodes.get(currentId)
      if (!node) break
      if (node.type === 'action') {
        actions.push(node as ActionNode)
      }
    }

    return { actions }
  }

  private matchTrigger(triggers: TriggerNode[], input: { text?: string; intent?: string }, vars: any) {
    const text = (input.text || '').toLowerCase()

    for (const trigger of triggers) {
      const type = trigger.data.triggerType
      const value = (trigger.data.value || '').toLowerCase()
      if (type === 'contains' && text.includes(value)) return trigger
      if (type === 'exact' && text === value) return trigger
      if (type === 'starts_with' && text.startsWith(value)) return trigger
      if (type === 'regex') {
        try {
          const re = new RegExp(trigger.data.value || '')
          if (re.test(text)) return trigger
        } catch {
          continue
        }
      }
      if (type === 'intent' && input.intent && input.intent === trigger.data.value) return trigger
    }

    return triggers.find((t) => t.data.triggerType === 'fallback')
  }

  private pickEdge(edges: FlowEdge[], vars: any, input: any) {
    if (edges.length === 1) return edges[0]
    for (const edge of edges) {
      if (!edge.condition) return edge
      if (this.evaluateCondition(edge.condition, vars, input)) return edge
    }
    return null
  }

  private evaluateCondition(condition: FlowEdge['condition'], vars: any, input: any) {
    if (!condition) return true
    const left = this.resolveValue(condition.left, vars, input)
    const right = this.resolveValue(condition.right, vars, input)
    switch (condition.operator) {
      case 'eq':
        return left === right
      case 'neq':
        return left !== right
      case 'contains':
        return String(left).includes(String(right))
      case 'regex':
        return new RegExp(String(right)).test(String(left))
      case 'gt':
        return Number(left) > Number(right)
      case 'lt':
        return Number(left) < Number(right)
      default:
        return false
    }
  }

  private resolveValue(value: string, vars: any, input: any) {
    if (value.startsWith('vars.')) {
      return vars[value.replace('vars.', '')]
    }
    if (value === 'input.text') return input.text
    if (value === 'input.intent') return input.intent
    return value
  }
}
