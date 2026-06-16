import * as React from 'react'

export const Dialog = ({ children }) => <div>{children}</div>
export const DialogTrigger = ({ children }) => <>{children}</>
export const DialogContent = ({ children }) => <div className="p-4">{children}</div>
export const DialogHeader = ({ children }) => <div className="p-2">{children}</div>
export const DialogTitle = ({ children }) => <h3 className="font-semibold">{children}</h3>

export default Dialog
