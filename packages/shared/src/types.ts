export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER'

export type TriggerType =
  | 'contains'
  | 'exact'
  | 'regex'
  | 'starts_with'
  | 'intent'
  | 'fallback'

export type ActionType =
  | 'send_text'
  | 'send_template'
  | 'send_interactive'
  | 'send_media'
  | 'delay'
  | 'set_variable'
  | 'call_webhook'
  | 'branch'

export interface FlowNodeBase {
  id: string
  type: 'trigger' | 'action'
  data: Record<string, unknown>
}

export interface TriggerNode extends FlowNodeBase {
  type: 'trigger'
  data: {
    triggerType: TriggerType
    value?: string
  }
}

export interface ActionNode extends FlowNodeBase {
  type: 'action'
  data: {
    actionType: ActionType
    [key: string]: unknown
  }
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  condition?: {
    operator: 'eq' | 'neq' | 'contains' | 'regex' | 'gt' | 'lt'
    left: string
    right: string
  }
}

export interface FlowDefinition {
  nodes: Array<TriggerNode | ActionNode>
  edges: FlowEdge[]
}

export interface RuntimeContext {
  workspaceId: string
  botId: string
  conversationId: string
  contactId: string
  variables: Record<string, unknown>
}

export interface IncomingMessage {
  id: string
  from: string
  text?: string
  interactive?: {
    type: 'button' | 'list'
    id: string
    title?: string
  }
}

export interface OutboundMessage {
  to: string
  type: 'text' | 'template' | 'interactive' | 'media'
  payload: Record<string, unknown>
}

export interface ApiResponse<T> {
  data: T
  meta?: Record<string, unknown>
}
