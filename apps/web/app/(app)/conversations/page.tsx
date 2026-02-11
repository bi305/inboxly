import { Card } from '@ui'
import Link from 'next/link'
import { apiFetchServer } from '../../../lib/server-api'

export default async function ConversationsPage() {
  const conversations = await apiFetchServer<any[]>('/conversations', {}, { workspace: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Conversations</h1>
        <p className="text-neutral-600">Monitor ongoing customer chats.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {conversations.map((conv) => (
          <Link key={conv.id} href={`/conversations/${conv.id}`}>
            <Card className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{conv.contact?.phoneNumber}</div>
                <span className="text-xs text-neutral-500">{conv.status}</span>
              </div>
              <p className="text-sm text-neutral-500">Bot: {conv.bot?.name}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
