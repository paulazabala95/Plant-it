// Who Plant It is shown for. The garden and the engine are the same for everyone;
// only this block changes per client (public site, an employer, later a bank or pension fund).

export interface WhereToStart {
  title: string
  text: string
  link?: { label: string; url: string }
}

export interface ClientConfig {
  id: string
  /** Shown as "Plant It for <name>" when it is not the public site. */
  name?: string
  whereToStart: WhereToStart
}

/** The public site: general education only, no providers named. */
export const PUBLIC_CLIENT: ClientConfig = {
  id: 'public',
  whereToStart: {
    title: 'Where to start',
    text: 'Compare at least three places: your own bank, an online broker and a robo-adviser. Check the yearly cost, whether they offer a monthly savings plan in index funds or ETFs, and that they are regulated in your country.',
  },
}
