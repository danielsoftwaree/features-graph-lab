interface BusinessSituationProps {
  text: string
}

export function BusinessSituation({ text }: BusinessSituationProps) {
  return (
    <section className="mb-8 rounded-xl border border-zinc-700 bg-zinc-900 p-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Business Situation
      </h2>
      <p className="leading-relaxed text-zinc-300">{text}</p>
    </section>
  )
}
