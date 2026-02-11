import './globals.css'
import { DM_Sans, Space_Grotesk } from 'next/font/google'

const display = DM_Sans({ subsets: ['latin'], variable: '--font-display' })
const body = Space_Grotesk({ subsets: ['latin'], variable: '--font-body' })

export const metadata = {
  title: 'Bot Builder',
  description: 'Multi-tenant WhatsApp Bot Builder'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-body`}>{children}</body>
    </html>
  )
}
