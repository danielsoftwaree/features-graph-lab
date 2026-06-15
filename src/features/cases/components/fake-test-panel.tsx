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
    <section className="mb-8 rounded-xl border border-zinc-700 bg-zinc-900 p-6 font-mono text-sm">
      <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Test Results
      </h2>
      <ul className="space-y-2">
        {displayResults.map((result) => (
          <li key={result.name} className="flex items-center gap-3">
            <span className={result.passed ? 'text-green-400' : 'text-red-400'}>
              {result.passed ? '✓' : '✗'}
            </span>
            <span className={result.passed ? 'text-zinc-300' : 'text-red-300 line-through'}>
              {result.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
