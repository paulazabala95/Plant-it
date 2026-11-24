import { useEffect, useState } from 'react'
import type { LifeEvent, PlotCount } from '../engine'
import { World, type Side } from './World'
import { Garden } from './Garden'
import { DEFAULT_ANSWERS, loadSession, saveSession, type Answers } from './answers'
import { Planner } from './Planner'
import { Onboarding } from './Onboarding'
import { Welcome } from './Welcome'

type Screen = 'welcome' | 'onboarding' | 'garden' | 'planner'

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
  // A returning visitor who made a plan starts on her Planner.
  const [saved] = useState(loadSession)
  const [screen, setScreen] = useState<Screen>(saved?.planner ? 'planner' : 'welcome')
  const [answers, setAnswers] = useState<Answers>(saved?.answers ?? DEFAULT_ANSWERS)
  const [events, setEvents] = useState<LifeEvent[]>(saved?.events ?? [])
  const [planner, setPlanner] = useState(saved?.planner ?? false)
  const [focusBreak, setFocusBreak] = useState(false)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])
  useEffect(() => {
    if (screen === 'garden' || screen === 'planner') saveSession({ answers, events, planner })
  }, [answers, events, planner, screen])

  const openPlanner = () => {
    setPlanner(true)
    setFocusBreak(false)
    setScreen('planner')
  }

  return (
    <main
      className={
        screen === 'garden'
          ? 'app garden-app'
          : screen === 'planner'
            ? 'app planner-app'
            : `app intro ${screen === 'welcome' ? 'centred' : ''}`
      }
    >
      {screen !== 'garden' && screen !== 'planner' && (
        <div className="backdrop" aria-hidden>
          <World mode="wide" progress={0.3} her={BACKDROP.her} twin={BACKDROP.twin} tick={0} />
        </div>
      )}
      {screen === 'welcome' && (
        <Welcome
          onStart={() => setScreen('onboarding')}
          onContinue={planner ? openPlanner : undefined}
        />
      )}
      {screen === 'onboarding' && (
        <Onboarding
          initial={answers}
          onBack={() => setScreen('welcome')}
          onDone={(a) => {
            setAnswers(a)
            setScreen('garden')
          }}
        />
      )}
      {screen === 'garden' && (
        <Garden
          answers={answers}
          events={events}
          setEvents={setEvents}
          onEdit={() => setScreen('onboarding')}
          onPlan={openPlanner}
          focusBreak={focusBreak}
        />
      )}
      {screen === 'planner' && (
        <Planner
          answers={answers}
          events={events}
          onGarden={() => {
            setFocusBreak(false)
            setScreen('garden')
          }}
          onEdit={() => setScreen('onboarding')}
          onAddBaby={(age) => {
            if (!events.some((e) => e.kind === 'child'))
              setEvents([...events, { kind: 'child', age }])
            setFocusBreak(false)
            setScreen('garden')
          }}
          onTryBreak={() => {
            setFocusBreak(true)
            setScreen('garden')
          }}
        />
      )}
      <footer className="footer">Not financial advice. These are illustrative assumptions.</footer>
    </main>
  )
}
