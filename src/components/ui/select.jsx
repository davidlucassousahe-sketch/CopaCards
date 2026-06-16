import * as React from 'react'

export const Select = ({ children, className = '', ...props }) => (
  <select className={`rounded-md border px-2 py-1 bg-background text-foreground ${className}`} {...props}>
    {children}
  </select>
)

export const SelectTrigger = Select
export const SelectContent = ({ children }) => <div>{children}</div>
export const SelectItem = ({ children, value }) => <option value={value}>{children}</option>
export const SelectValue = ({ children }) => <span>{children}</span>

export default Select
