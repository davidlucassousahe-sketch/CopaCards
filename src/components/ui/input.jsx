import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} className={cn('w-full rounded-md border px-3 py-2 bg-background text-foreground', className)} {...props} />
))
Input.displayName = 'Input'

export { Input }
