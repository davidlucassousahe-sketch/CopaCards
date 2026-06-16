export const Card = ({ className = '', ...props }) => (
  <div className={`rounded-lg border border-border bg-card ${className}`} {...props} />
)

export const CardContent = ({ className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props} />
)

export const CardHeader = ({ className = '', ...props }) => (
  <div className={`p-4 pb-0 ${className}`} {...props} />
)

export const CardTitle = ({ className = '', ...props }) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props} />
)

export const CardDescription = ({ className = '', ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props} />
)
