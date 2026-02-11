import { apiFetchServer } from '../../../../lib/server-api'
import SimulatorClient from './SimulatorClient'

export default async function BotSimulatorPage({ params }: { params: { botId: string } }) {
  const published = await apiFetchServer<{ flow?: any }>(
    `/bots/${params.botId}/versions/published`,
    {},
    { workspace: true }
  )
  const flow =
    published?.flow || {
      nodes: [
        { id: 'trigger-1', type: 'trigger', data: { triggerType: 'contains', value: 'pricing' } },
        { id: 'action-1', type: 'action', data: { actionType: 'send_text', text: 'Pricing is $99/mo.' } }
      ],
      edges: [{ id: 'edge-1', source: 'trigger-1', target: 'action-1' }]
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Simulator</h1>
        <p className="text-neutral-600">Test your flow before publishing.</p>
      </div>
      <SimulatorClient flowJson={JSON.stringify(flow)} />
    </div>
  )
}
