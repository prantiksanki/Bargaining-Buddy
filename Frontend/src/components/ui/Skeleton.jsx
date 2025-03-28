export default function Skeleton({ className = "", ...props }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} {...props} />
}

