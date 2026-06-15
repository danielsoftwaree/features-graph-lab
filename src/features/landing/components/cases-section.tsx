import type { CaseMeta } from '@/features/cases/types/case'
import { CaseCard } from './case-card'

const CASES: CaseMeta[] = [
  {
    slug: 'double-charge',
    title: 'Case 001: Double Charge',
    description: 'A payment retry bug that charges users twice. Why idempotency keys exist.',
    status: 'available',
  },
  {
    slug: 'referral-abuse',
    title: 'Case 002: Referral Abuse',
    description: 'A referral system that can be gamed for infinite credits.',
    status: 'coming-soon',
  },
  {
    slug: 'last-item-race',
    title: 'Case 003: Last Item Race',
    description: 'Two users buy the last item simultaneously. Who gets it?',
    status: 'coming-soon',
  },
]

export function CasesSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-20">
      <h2 className="mb-6 text-xl font-semibold text-zinc-300">Cases</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CASES.map((c) => (
          <CaseCard key={c.slug} caseMeta={c} />
        ))}
      </div>
    </section>
  )
}
