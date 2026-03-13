'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200',
            'focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-100',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
