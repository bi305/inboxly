'use server'

import { redirect } from 'next/navigation'
import { apiFetchServer } from '../../../lib/server-api'

export async function startMetaConnect() {
  const response = await apiFetchServer<{ url: string }>(
    '/auth/meta/start',
    { method: 'POST' },
    { workspace: true }
  )
  redirect(response.url)
}

export async function testConnection(formData: FormData) {
  const connectionId = String(formData.get('connectionId') || '')
  if (!connectionId) return
  await apiFetchServer(`/whatsapp/connections/${connectionId}/test`, { method: 'POST' }, { workspace: true })
  redirect('/whatsapp')
}
