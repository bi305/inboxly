import { Card } from '@ui'
import { apiFetchServer } from '../../../lib/server-api'

export default async function AnalyticsPage() {
  const metrics = await apiFetchServer<{ bots: number; conversations: number }>(
    '/metrics',
    {},
    { workspace: true }
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-neutral-600">Keep an eye on delivery and engagement.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="space-y-2">
          <div className="text-sm text-neutral-500">Bots</div>
          <div className="text-2xl font-semibold">{metrics.bots}</div>
        </Card>
        <Card className="space-y-2">
          <div className="text-sm text-neutral-500">Conversations</div>
          <div className="text-2xl font-semibold">{metrics.conversations}</div>
        </Card>
        <Card className="space-y-2">
          <div className="text-sm text-neutral-500">Avg response time</div>
          <div className="text-2xl font-semibold">--</div>
        </Card>
      </div>
    </div>
  )
}
