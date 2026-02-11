'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { apiFetchServer } from '../../../lib/server-api'

export async function createWorkspace(formData: FormData) {
  const name = String(formData.get('name') || '')
  if (!name) return
  await apiFetchServer('/workspaces', {
    method: 'POST',
    body: JSON.stringify({ name })
  })
  redirect('/workspaces')
}

export async function selectWorkspace(formData: FormData) {
  const workspaceId = String(formData.get('workspaceId') || '')
  if (!workspaceId) return
  cookies().set('workspaceId', workspaceId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  })
  redirect('/bots')
}
