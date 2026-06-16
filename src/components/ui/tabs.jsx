import * as React from 'react'

export const Tabs = ({ children, value }) => <div>{children}</div>
export const TabsList = ({ children }) => <div className="flex space-x-2">{children}</div>
export const TabsTrigger = ({ children, onClick }) => <button onClick={onClick} className="px-3 py-1">{children}</button>
export const TabsContent = ({ children }) => <div>{children}</div>

export default Tabs
