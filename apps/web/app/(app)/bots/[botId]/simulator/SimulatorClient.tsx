'use client'

import { useFormState } from 'react-dom'
import { Button, Card, Input } from '@ui'
import { simulateBot } from '../actions'

const initialState: { actions?: any[]; message?: string } = {}

export default function SimulatorClient({ flowJson }: { flowJson: string }) {
  const [state, formAction] = useFormState(simulateBot as any, initialState)

  return (
    <Card className="space-y-4">
      <div className="space-y-3">
        {state.message && (
          <div className="ml-auto max-w-md rounded-2xl bg-ink p-3 text-sm text-white">
            User: {state.message}
          </div>
        )}
        {state.actions?.map((action, index) => (
          <div key={index} className="max-w-md rounded-2xl bg-neutral-100 p-3 text-sm">
            Bot action: {action.data?.actionType || 'action'}
          </div>
        ))}
      </div>
      <form action={formAction} className="flex gap-2">
        <input type="hidden" name="flow" value={flowJson} />
        <Input name="message" placeholder="Type a message..." />
        <Button type="submit">Send</Button>
      </form>
    </Card>
  )
}
