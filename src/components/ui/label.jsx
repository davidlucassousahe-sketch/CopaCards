import * as React from 'react'

export const Label = ({ children, htmlFor, className = '', ...props }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium ${className}`} {...props}>{children}</label>
)

export default Label
