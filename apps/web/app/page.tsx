import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 text-white">
      <h1 className="text-3xl font-semibold">Inboxly Bot Builder</h1>
      <p className="text-white/70">Design, test, and deploy WhatsApp automation.</p>
      <Link className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black" href="/sign-in">
        Get started
      </Link>
    </div>
  )
}
