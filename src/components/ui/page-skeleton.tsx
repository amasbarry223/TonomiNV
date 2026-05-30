export function PageSkeleton() {
  return (
    <div className="min-h-[60vh] animate-pulse px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-10 w-48 rounded bg-gold/10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-lg bg-gold/10" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SectionSkeleton({ className = 'min-h-[320px]' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gold/5 ${className}`} />
}
