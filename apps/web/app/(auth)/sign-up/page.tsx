import { Button, Input } from '@ui'
import Link from 'next/link'
import { signUp } from '../actions'

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create your workspace</h1>
        <p className="text-white/70">Start building bots with your team.</p>
      </div>
      <form className="space-y-4" action={signUp}>
        <Input name="name" type="text" placeholder="Name" />
        <Input name="email" type="email" placeholder="Email" />
        <Input name="password" type="password" placeholder="Password" />
        <Input name="workspaceName" type="text" placeholder="Workspace name" />
        <Button className="w-full">Create account</Button>
      </form>
      <p className="text-sm text-white/70">
        Already have an account? <Link className="underline" href="/sign-in">Sign in</Link>
      </p>
    </div>
  )
}
