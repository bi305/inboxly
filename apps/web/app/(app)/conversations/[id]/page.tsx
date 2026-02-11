import { Card } from '@ui'
import { apiFetchServer } from '../../../../lib/server-api'

export default async function ConversationDetailPage({ params }: { params: { id: string } }) {
  const messages = await apiFetchServer<any[]>(
    `/conversations/${params.id}/messages`,
    {},
    { workspace: true }
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Conversation</h1>
        <p className="text-neutral-600">Message history</p>
      </div>
      <Card className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="rounded-lg border border-neutral-200 p-3 text-sm">
            <div className="text-xs text-neutral-500">{msg.direction}</div>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(msg.payload, null, 2)}
            </pre>
          </div>
        ))}
      </Card>
    </div>
  )
}
