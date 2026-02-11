"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowDefinitionSchema = exports.FlowEdgeSchema = exports.ActionNodeSchema = exports.TriggerNodeSchema = exports.ActionTypeSchema = exports.TriggerTypeSchema = void 0;
const zod_1 = require("zod");
exports.TriggerTypeSchema = zod_1.z.enum([
    'contains',
    'exact',
    'regex',
    'starts_with',
    'intent',
    'fallback'
]);
exports.ActionTypeSchema = zod_1.z.enum([
    'send_text',
    'send_template',
    'send_interactive',
    'send_media',
    'delay',
    'set_variable',
    'call_webhook',
    'branch'
]);
exports.TriggerNodeSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.literal('trigger'),
    data: zod_1.z.object({
        triggerType: exports.TriggerTypeSchema,
        value: zod_1.z.string().optional()
    })
});
exports.ActionNodeSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.literal('action'),
    data: zod_1.z.object({
        actionType: exports.ActionTypeSchema
    }).catchall(zod_1.z.any())
});
exports.FlowEdgeSchema = zod_1.z.object({
    id: zod_1.z.string(),
    source: zod_1.z.string(),
    target: zod_1.z.string(),
    condition: zod_1.z
        .object({
        operator: zod_1.z.enum(['eq', 'neq', 'contains', 'regex', 'gt', 'lt']),
        left: zod_1.z.string(),
        right: zod_1.z.string()
    })
        .optional()
});
exports.FlowDefinitionSchema = zod_1.z.object({
    nodes: zod_1.z.array(zod_1.z.union([exports.TriggerNodeSchema, exports.ActionNodeSchema])),
    edges: zod_1.z.array(exports.FlowEdgeSchema)
});
