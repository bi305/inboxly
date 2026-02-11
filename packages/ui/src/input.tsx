import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-black  text-black
 ${className}`}
      {...props}
    />
  );
}
