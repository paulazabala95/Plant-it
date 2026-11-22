/** Event the "How Plant It thinks" section listens for, to open a principle. */
export const PRINCIPLE_EVENT = 'plant-it:principle'

/** Opens a principle in "How Plant It thinks" and scrolls to it. */
export function showPrinciple(id: string) {
  window.dispatchEvent(new CustomEvent<string>(PRINCIPLE_EVENT, { detail: id }))
}
