import { useEffect, useState } from 'react'

const QUERY = '(max-width: 760px)'

/** True on narrow screens, where the two gardens are stacked instead of side by side. */
export function useIsPhone(): boolean {
  const [phone, setPhone] = useState(() => window.matchMedia(QUERY).matches)
  useEffect(() => {
    const m = window.matchMedia(QUERY)
    const on = () => setPhone(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return phone
}
