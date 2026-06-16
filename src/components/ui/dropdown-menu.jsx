import * as React from 'react'

export const DropdownMenu = ({ children }) => <div className="relative inline-block">{children}</div>
export const DropdownMenuTrigger = ({ children }) => <div>{children}</div>
export const DropdownMenuContent = ({ children }) => <div className="absolute bg-card border border-border rounded-md shadow-sm">{children}</div>
export const DropdownMenuItem = ({ children, onClick }) => <div onClick={onClick} className="px-3 py-2 hover:bg-muted">{children}</div>

export default DropdownMenu
