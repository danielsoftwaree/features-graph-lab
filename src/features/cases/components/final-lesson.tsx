interface FinalLessonProps {
  lesson: string
}

export function FinalLesson({ lesson }: FinalLessonProps) {
  return (
    <section className="rounded-xl border border-yellow-800 bg-yellow-950/30 p-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-yellow-500">
        Key Takeaway
      </h2>
      <p className="leading-relaxed text-yellow-200">{lesson}</p>
    </section>
  )
}
