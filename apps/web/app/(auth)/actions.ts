'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { apiFetchServer } from '../../lib/server-api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const result = await apiFetchServer<{
    tokens: { accessToken: string; refreshToken: string }
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }, { auth: false })

  setAuthCookies(result.tokens)

  // Pick first workspace for convenience on sign-in
  try {
    const res = await fetch(`${API_URL}/workspaces`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${result.tokens.accessToken}`
      },
      cache: 'no-store'
    })
    if (res.ok) {
      const workspaces = (await res.json()) as Array<{ id: string }>
      const first = workspaces?.[0]
      if (first?.id) {
        cookies().set('workspaceId', first.id, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 * 30
        })
        redirect('/bots')
      }
    }
  } catch {
    // ignore
  }

  redirect('/workspaces')
}

export async function signUp(formData: FormData) {
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const name = String(formData.get('name') || '')
  const workspaceName = String(formData.get('workspaceName') || '')
  const result = await apiFetchServer<{
    tokens: { accessToken: string; refreshToken: string }
    workspace: { id: string }
  }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, workspaceName })
  }, { auth: false })

  setAuthCookies(result.tokens)
  if (result.workspace?.id) {
    cookies().set('workspaceId', result.workspace.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })
  }
  redirect('/workspaces')
}

export async function signOut() {
  const cookieStore = cookies()
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  cookieStore.delete('workspaceId')
  redirect('/sign-in')
}

function setAuthCookies(tokens: { accessToken: string; refreshToken: string }) {
  const cookieStore = cookies()
  const secure = process.env.NODE_ENV === 'production'
  if (tokens?.accessToken) {
    cookieStore.set('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: 60 * 15
    })
  }
  if (tokens?.refreshToken) {
    cookieStore.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })
  }
}
