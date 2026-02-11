import { RuntimeEngine } from '../src/modules/runtime/runtime.engine'

describe('RuntimeEngine', () => {
  it('matches contains trigger and emits send_text action', () => {
    const flow = {
      nodes: [
        { id: 't1', type: 'trigger', data: { triggerType: 'contains', value: 'hi' } },
        { id: 'a1', type: 'action', data: { actionType: 'send_text', text: 'Hello' } }
      ],
      edges: [{ id: 'e1', source: 't1', target: 'a1' }]
    }

    const engine = new RuntimeEngine()
    const result = engine.execute(flow as any, { text: 'hi there' }, {})
    expect(result.actions).toHaveLength(1)
    expect(result.actions[0].data.actionType).toBe('send_text')
  })
})
