import 'server-only'

import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export function getAccessToken() {
  return cookies().get('accessToken')?.value
}

export function getWorkspaceId() {
  return cookies().get('workspaceId')?.value
}

export async function apiFetchServer<T>(
  path: string,
  options: RequestInit = {},
  opts: { workspace?: boolean; auth?: boolean } = { auth: true, workspace: false }
): Promise<T> {
  const headers = new Headers(options.headers || {})
  headers.set('Content-Type', 'application/json')

  if (opts.auth !== false) {
    const token = getAccessToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  if (opts.workspace) {
    const workspaceId = getWorkspaceId()
    if (workspaceId) {
      headers.set('x-workspace-id', workspaceId)
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store'
  })

  if (!res.ok) {
    const message = await res.text()
    throw new Error(`API error ${res.status}: ${message}`)
  }

  return res.json()
}
