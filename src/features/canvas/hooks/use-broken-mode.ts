import { useState } from 'react'

type UseBrokenMode = {
  isBroken: boolean
  toggle: () => void
}

export function useBrokenMode(): UseBrokenMode {
  const [isBroken, setIsBroken] = useState(false)
  return { isBroken, toggle: () => setIsBroken((v) => !v) }
}
