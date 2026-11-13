import { useEffect, useState } from 'react'
import type { PlotCount } from '../engine'
import { World, type Side } from './World'
import { Garden } from './Garden'
import { HowItWorks } from './HowItWorks'
import { DEFAULT_ANSWERS, type Answers } from './answers'
import { Onboarding } from './Onboarding'
import { Welcome } from './Welcome'

type Screen = 'welcome' | 'how' | 'onboarding' | 'garden'

const still = (counts: [PlotCount['plot'], number][]): PlotCount[] =>
  counts.map(([plot, plants]) => ({ plot, plants, growth: 0.6 }))

// A quiet garden behind the intro screens (pictures only, no numbers).
const BACKDROP: { her: Side; twin: Side } = {
  her: {
    counts: still([
      ['pension', 5],
      ['indexFund', 6],
      ['sustainableFund', 4],
      ['cash', 1],
    ]),
    hair: '#3B2A2A',
    glasses: false,
    baby: false,
    mood: 'happy',
    label: 'You',
    value: '',
    promoted: false,
    seeds: 0,
  },
  twin: {
    counts: still([
      ['pension', 6],
      ['indexFund', 9],
      ['singleStocks', 2],
      ['cash', 1],
    ]),
    hair: '#4A3426',
    glasses: false,
    baby: false,
    mood: 'happy',
    label: 'Your twin',
    value: '',
    promoted: false,
    seeds: 0,
  },
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  return (
    <main
      className={
        screen === 'garden'
          ? 'app garden-app'
          : `app intro ${screen === 'welcome' ? 'centred' : ''}`
      }
    >
      {screen !== 'garden' && (
        <div className="backdrop" aria-hidden>
          <World mode="wide" progress={0.3} her={BACKDROP.her} twin={BACKDROP.twin} tick={0} />
        </div>
      )}
      {screen === 'welcome' && <Welcome onStart={() => setScreen('onboarding')} />}
      {screen === 'onboarding' && (
        <Onboarding
          initial={answers}
          onBack={() => setScreen('welcome')}
          onDone={(a) => {
            setAnswers(a)
            setScreen('how')
          }}
        />
      )}
      {screen === 'how' && (
        <HowItWorks
          answers={answers}
          onNext={() => setScreen('garden')}
          onBack={() => setScreen('onboarding')}
        />
      )}
      {screen === 'garden' && <Garden answers={answers} onEdit={() => setScreen('onboarding')} />}
      <footer className="footer">Not financial advice. These are illustrative assumptions.</footer>
    </main>
  )
}
