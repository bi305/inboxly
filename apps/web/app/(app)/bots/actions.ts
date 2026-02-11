'use server'

import { redirect } from 'next/navigation'
import { apiFetchServer } from '../../../lib/server-api'

export async function createBot(formData: FormData) {
  const name = String(formData.get('name') || '')
  if (!name) return
  await apiFetchServer('/bots', {
    method: 'POST',
    body: JSON.stringify({ name })
  }, { workspace: true })
  redirect('/bots')
}
