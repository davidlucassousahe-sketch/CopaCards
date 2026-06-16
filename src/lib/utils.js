export function cn(...args) {
  return args
    .flatMap(a => typeof a === 'string' ? a.split(' ') : (a || []))
    .filter(Boolean)
    .join(' ')
}
