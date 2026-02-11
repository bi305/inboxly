import { Button, Card, Input } from '@ui'
import { apiFetchServer } from '../../../lib/server-api'
import { createWorkspace, selectWorkspace } from './actions'

export default async function WorkspacesPage() {
  const workspaces = await apiFetchServer<any[]>('/workspaces')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Workspaces</h1>
          <p className="text-neutral-600">Pick where you want to build.</p>
        </div>
        <form action={createWorkspace} className="flex items-center gap-2">
          <Input name="name" placeholder="Workspace name" />
          <Button type="submit">Create workspace</Button>
        </form>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className="space-y-3">
            <div className="text-lg font-semibold">{workspace.name}</div>
            <p className="text-sm text-neutral-500">
              {workspace.members?.length || 1} members
            </p>
            <form action={selectWorkspace}>
              <input type="hidden" name="workspaceId" value={workspace.id} />
              <Button variant="secondary" type="submit">
                Open
              </Button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  )
}
