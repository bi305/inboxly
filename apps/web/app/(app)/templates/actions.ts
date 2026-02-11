'use server'

import { redirect } from 'next/navigation'
import { apiFetchServer } from '../../../lib/server-api'

export async function addTemplate(formData: FormData) {
  const name = String(formData.get('name') || '')
  const language = String(formData.get('language') || '')
  if (!name || !language) return
  await apiFetchServer('/templates', {
    method: 'POST',
    body: JSON.stringify({ name, language })
  }, { workspace: true })
  redirect('/templates')
}
