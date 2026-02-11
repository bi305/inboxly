import { Button, Card, Input } from '@ui'
import { apiFetchServer } from '../../../lib/server-api'
import { addTemplate } from './actions'

export default async function TemplatesPage() {
  const templates = await apiFetchServer<any[]>('/templates', {}, { workspace: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Templates</h1>
          <p className="text-neutral-600">Manage approved WhatsApp templates.</p>
        </div>
        <form action={addTemplate} className="flex items-center gap-2">
          <Input name="name" placeholder="Template name" />
          <Input name="language" placeholder="Language (en_US)" />
          <Button type="submit" variant="secondary">Add</Button>
        </form>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((tpl) => (
          <Card key={tpl.id} className="space-y-2">
            <div className="font-semibold">{tpl.name}</div>
            <p className="text-sm text-neutral-500">Language: {tpl.language}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
