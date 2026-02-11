import { Button, Card, Input } from '@ui'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { apiFetchServer } from '../../../lib/server-api'
import { createBot } from './actions'

export default async function BotsPage() {
  const workspaceId = cookies().get('workspaceId')?.value
  if (!workspaceId) {
    redirect('/workspaces')
  }

  const bots = await apiFetchServer<any[]>('/bots', {}, { workspace: true })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bots</h1>
          <p className="text-neutral-600">Build flows that power your WhatsApp experiences.</p>
        </div>
        <form action={createBot} className="flex items-center gap-2">
          <Input name="name" placeholder="Bot name" />
          <Button type="submit">Create bot</Button>
        </form>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {bots.map((bot) => (
          <Card key={bot.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{bot.name}</div>
              <span className="rounded-full bg-moss/10 px-2 py-1 text-xs text-moss">Active</span>
            </div>
            <p className="text-sm text-neutral-500">Bot ID: {bot.id}</p>
            <div className="flex gap-2">
              <Link href={`/bots/${bot.id}/editor`} className="text-sm underline">
                Edit flow
              </Link>
              <Link href={`/bots/${bot.id}/simulator`} className="text-sm underline">
                Simulator
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
