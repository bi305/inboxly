import { z } from 'zod'

export const TriggerTypeSchema = z.enum([
  'contains',
  'exact',
  'regex',
  'starts_with',
  'intent',
  'fallback'
])

export const ActionTypeSchema = z.enum([
  'send_text',
  'send_template',
  'send_interactive',
  'send_media',
  'delay',
  'set_variable',
  'call_webhook',
  'branch'
])

export const TriggerNodeSchema = z.object({
  id: z.string(),
  type: z.literal('trigger'),
  data: z.object({
    triggerType: TriggerTypeSchema,
    value: z.string().optional()
  })
})

export const ActionNodeSchema = z.object({
  id: z.string(),
  type: z.literal('action'),
  data: z.object({
    actionType: ActionTypeSchema
  }).catchall(z.any())
})

export const FlowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  condition: z
    .object({
      operator: z.enum(['eq', 'neq', 'contains', 'regex', 'gt', 'lt']),
      left: z.string(),
      right: z.string()
    })
    .optional()
})

export const FlowDefinitionSchema = z.object({
  nodes: z.array(z.union([TriggerNodeSchema, ActionNodeSchema])),
  edges: z.array(FlowEdgeSchema)
})
