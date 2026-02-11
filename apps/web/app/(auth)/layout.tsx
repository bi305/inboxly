export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-10 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  )
}
