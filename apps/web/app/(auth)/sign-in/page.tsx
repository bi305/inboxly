import { Button, Input } from '@ui'
import Link from 'next/link'
import { signIn } from '../actions'

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-white/70">Sign in to manage your WhatsApp bots.</p>
      </div>
      <form className="space-y-4" action={signIn}>
        <Input name="email" type="email" placeholder="Email" />
        <Input name="password" type="password" placeholder="Password" />
        <Button className="w-full">Sign in</Button>
      </form>
      <Link href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/google`}>
        <Button variant="secondary" className="w-full">
          Continue with Google
        </Button>
      </Link>
      <p className="text-sm text-white/70">
        New here? <Link className="underline" href="/sign-up">Create an account</Link>
      </p>
    </div>
  )
}
