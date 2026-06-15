interface CaseHeaderProps {
  title: string
}

export function CaseHeader({ title }: CaseHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
    </header>
  )
}
