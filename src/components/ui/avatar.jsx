import * as React from 'react'

export const Avatar = ({ children, className = '', ...props }) => (
  <div className={['inline-flex items-center justify-center overflow-hidden rounded-full', className].join(' ')} {...props}>
    {children}
  </div>
)

export const AvatarImage = ({ src, alt, ...props }) => (
  <img src={src} alt={alt} {...props} className="block h-full w-full object-cover" />
)

export const AvatarFallback = ({ children, ...props }) => (
  <div {...props} className="flex items-center justify-center w-full h-full">{children}</div>
)

export default Avatar
