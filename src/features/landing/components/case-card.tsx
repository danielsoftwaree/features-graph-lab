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
        'rounded-xl border p-6 transition-colors',
        isAvailable
          ? 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
          : 'cursor-not-allowed border-zinc-800 bg-zinc-900/40 opacity-60',
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
        <span className="text-xs font-medium text-zinc-500">
          {caseMeta.status === 'coming-soon' ? 'Coming soon' : 'Available'}
        </span>
      </div>
      <h3 className="mb-1 font-semibold text-zinc-100">{caseMeta.title}</h3>
      <p className="text-sm text-zinc-400">{caseMeta.description}</p>
    </>
  )
}
