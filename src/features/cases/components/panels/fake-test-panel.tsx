import type { TestResult } from '../types/case'

interface FakeTestPanelProps {
  results: TestResult[]
  isBroken: boolean
}

export function FakeTestPanel({ results, isBroken }: FakeTestPanelProps) {
  const displayResults = isBroken
    ? results.map((r) => ({ ...r, passed: false }))
    : results

  return (
    <section className="mb-8 rounded-xl border border-border bg-card p-6 font-mono text-sm">
      <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Test Results
      </h2>
      <ul className="space-y-2">
        {displayResults.map((result) => (
          <li key={result.name} className="flex items-center gap-3">
            <span className={result.passed ? 'text-success' : 'text-destructive'}>
              {result.passed ? '✓' : '✗'}
            </span>
            <span className={result.passed ? 'text-foreground' : 'text-destructive line-through'}>
              {result.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
