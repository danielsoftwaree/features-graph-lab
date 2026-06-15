interface BusinessSituationProps {
  text: string
}

export function BusinessSituation({ text }: BusinessSituationProps) {
  return (
    <section className="mb-8 rounded-xl border border-border bg-card p-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Business Situation
      </h2>
      <p className="leading-relaxed text-foreground">{text}</p>
    </section>
  )
}
