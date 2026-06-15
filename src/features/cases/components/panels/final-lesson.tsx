interface FinalLessonProps {
  lesson: string
}

export function FinalLesson({ lesson }: FinalLessonProps) {
  return (
    <section className="rounded-xl border border-warning-border bg-warning-surface p-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-warning">
        Key Takeaway
      </h2>
      <p className="leading-relaxed text-warning-foreground">{lesson}</p>
    </section>
  )
}
