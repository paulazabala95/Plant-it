/** Opens a principle card in "How Plant It thinks" and scrolls to it. */
export function showPrinciple(id: string) {
  const el = document.getElementById(`principle-${id}`) as HTMLDetailsElement | null
  if (!el) return
  el.open = true
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
