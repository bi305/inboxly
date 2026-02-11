import { Button, Card } from '@ui'
import { FlowCanvas } from '../../../../components/flow-canvas'
import { publishBot, saveDraft } from './actions'

export default function BotEditorPage({ params }: { params: { botId: string } }) {
  const flow = {
    nodes: [
      { id: 'trigger-1', type: 'trigger', data: { triggerType: 'contains', value: 'pricing' } },
      { id: 'action-1', type: 'action', data: { actionType: 'send_text', text: 'Pricing is $99/mo.' } }
    ],
    edges: [{ id: 'edge-1', source: 'trigger-1', target: 'action-1' }]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bot Editor</h1>
          <p className="text-neutral-600">Build triggers and actions for your flow.</p>
        </div>
        <div className="flex gap-2">
          <form action={saveDraft}>
            <input type="hidden" name="botId" value={params.botId} />
            <input type="hidden" name="flow" value={JSON.stringify(flow)} />
            <Button variant="secondary" type="submit">Save draft</Button>
          </form>
          <form action={publishBot}>
            <input type="hidden" name="botId" value={params.botId} />
            <input type="hidden" name="flow" value={JSON.stringify(flow)} />
            <Button type="submit">Publish</Button>
          </form>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">Nodes</h2>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-neutral-200 p-3">Trigger: text contains</div>
            <div className="rounded-lg border border-neutral-200 p-3">Action: send text</div>
            <div className="rounded-lg border border-neutral-200 p-3">Action: interactive buttons</div>
            <div className="rounded-lg border border-neutral-200 p-3">Action: webhook call</div>
          </div>
        </Card>
        <FlowCanvas />
      </div>
    </div>
  )
}
