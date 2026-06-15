interface BusinessImpactPanelProps {
  impacts: string[]
}

export function BusinessImpactPanel({ impacts }: BusinessImpactPanelProps) {
  return (
    <section className="mb-8 rounded-xl border border-red-900 bg-red-950/30 p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-red-400">
        Business Impact (when broken)
      </h2>
      <ul className="space-y-2">
        {impacts.map((impact) => (
          <li key={impact} className="flex items-start gap-2 text-sm text-red-300">
            <span className="mt-0.5 text-red-500">→</span>
            {impact}
          </li>
        ))}
      </ul>
    </section>
  )
}
