'use server'

import { redirect } from 'next/navigation'
import { apiFetchServer } from '../../../../lib/server-api'

function defaultFlow() {
  return {
    nodes: [
      { id: 'trigger-1', type: 'trigger', data: { triggerType: 'contains', value: 'pricing' } },
      { id: 'action-1', type: 'action', data: { actionType: 'send_text', text: 'Pricing is $99/mo.' } }
    ],
    edges: [{ id: 'edge-1', source: 'trigger-1', target: 'action-1' }]
  }
}

export async function saveDraft(formData: FormData) {
  const botId = String(formData.get('botId') || '')
  const flow = formData.get('flow')
  const payload = flow ? JSON.parse(String(flow)) : defaultFlow()
  await apiFetchServer(`/bots/${botId}/versions`, {
    method: 'POST',
    body: JSON.stringify({ flow: payload })
  }, { workspace: true })
  redirect(`/bots/${botId}/editor`)
}

export async function publishBot(formData: FormData) {
  const botId = String(formData.get('botId') || '')
  const flow = formData.get('flow')
  const payload = flow ? JSON.parse(String(flow)) : defaultFlow()
  const version = await apiFetchServer<{ id: string }>(`/bots/${botId}/versions`, {
    method: 'POST',
    body: JSON.stringify({ flow: payload })
  }, { workspace: true })
  await apiFetchServer(`/bots/${botId}/versions/${version.id}/publish`, {
    method: 'POST'
  }, { workspace: true })
  redirect(`/bots/${botId}/editor`)
}

export async function simulateBot(prevState: any, formData: FormData) {
  const message = String(formData.get('message') || '')
  const flow = formData.get('flow')
  const payload = flow ? JSON.parse(String(flow)) : defaultFlow()

  const actions = await apiFetchServer<any[]>(
    '/runtime/simulate',
    {
      method: 'POST',
      body: JSON.stringify({ flow: payload, text: message, variables: {} })
    },
    { workspace: true }
  )

  return { actions, message }
}
