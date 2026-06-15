interface BusinessImpactPanelProps {
  impacts: string[]
}

export function BusinessImpactPanel({ impacts }: BusinessImpactPanelProps) {
  return (
    <section className="mb-8 rounded-xl border border-destructive-border bg-destructive-surface p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-destructive">
        Business Impact (when broken)
      </h2>
      <ul className="space-y-2">
        {impacts.map((impact) => (
          <li key={impact} className="flex items-start gap-2 text-sm text-destructive">
            <span className="mt-0.5 text-destructive">→</span>
            {impact}
          </li>
        ))}
      </ul>
    </section>
  )
}
