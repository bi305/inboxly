import * as React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2'
  const styles: Record<ButtonVariant, string> = {
    primary: 'bg-black text-white hover:bg-neutral-800 focus:ring-black',
    secondary: 'bg-neutral-100 text-black hover:bg-neutral-200 focus:ring-neutral-400',
    ghost: 'bg-transparent text-black hover:bg-neutral-100 focus:ring-neutral-300'
  }
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />
}
