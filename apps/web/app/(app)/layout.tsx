import { Button } from '@ui'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { signOut } from '../(auth)/actions'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('accessToken')?.value
  if (!token) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen gradient-grid">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/workspaces" className="text-lg font-semibold">
            Inboxly Bots
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/bots" className="hover:underline">
              Bots
            </Link>
            <Link href="/conversations" className="hover:underline">
              Conversations
            </Link>
            <Link href="/whatsapp" className="hover:underline">
              WhatsApp
            </Link>
            <Link href="/analytics" className="hover:underline">
              Analytics
            </Link>
            <form action={signOut}>
              <Button variant="secondary" type="submit">
                Sign out
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  )
}
