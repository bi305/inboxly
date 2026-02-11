import { Button, Card } from '@ui'
import { apiFetchServer } from '../../../lib/server-api'
import { startMetaConnect, testConnection } from './actions'

export default async function WhatsAppSettingsPage() {
  const connections = await apiFetchServer<any[]>('/whatsapp/connections', {}, { workspace: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">WhatsApp Integration</h1>
        <p className="text-neutral-600">Connect your WhatsApp Business number via Meta.</p>
      </div>
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Connect WhatsApp</h2>
        <p className="text-sm text-neutral-600">
          We’ll open Meta’s onboarding flow. You won’t need to copy any IDs or tokens.
        </p>
        <form action={startMetaConnect}>
          <Button type="submit">Connect WhatsApp</Button>
        </form>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Connections</h2>
        {connections.length === 0 && (
          <Card className="text-sm text-neutral-600">No connected numbers yet.</Card>
        )}
        {connections.map((conn) => (
          <Card key={conn.id} className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{conn.phoneNumberId}</div>
              <div className="text-sm text-neutral-500">Bot: {conn.botId || 'Unassigned'}</div>
            </div>
            <form action={testConnection}>
              <input type="hidden" name="connectionId" value={conn.id} />
              <Button variant="secondary" type="submit">Test connection</Button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  )
}
