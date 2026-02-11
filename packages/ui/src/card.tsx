import * as React from 'react'

export function Card({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-xl border border-neutral-200 bg-white p-6 ${className}`} {...props} />
}
