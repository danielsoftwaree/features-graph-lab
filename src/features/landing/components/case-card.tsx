import { Link } from '@tanstack/react-router'
import { cn } from '@/shared/lib/cn'
import type { CaseMeta } from '@/features/cases/types/case'

interface CaseCardProps {
  caseMeta: CaseMeta
}

export function CaseCard({ caseMeta }: CaseCardProps) {
  const isAvailable = caseMeta.status === 'available'

  return (
    <div
      className={cn(
        'rounded-xl border p-6 transition-[border-color,box-shadow,translate] duration-200',
        isAvailable
          ? 'border-border bg-card hover:-translate-y-0.5 hover:border-ring hover:shadow-md'
          : 'cursor-not-allowed border-border bg-card/40 opacity-60',
      )}
    >
      {isAvailable ? (
        <Link to="/cases/$slug" params={{ slug: caseMeta.slug }} className="block">
          <CardContent caseMeta={caseMeta} />
        </Link>
      ) : (
        <CardContent caseMeta={caseMeta} />
      )}
    </div>
  )
}

function CardContent({ caseMeta }: { caseMeta: CaseMeta }) {
  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {caseMeta.status === 'coming-soon' ? 'Coming soon' : 'Available'}
        </span>
      </div>
      <h3 className="mb-1 font-semibold text-foreground">{caseMeta.title}</h3>
      <p className="text-sm text-muted-foreground">{caseMeta.description}</p>
    </>
  )
}
