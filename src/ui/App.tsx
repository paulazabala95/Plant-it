import { useState } from 'react'
import { Garden } from './Garden'
import { DEFAULT_ANSWERS, type Answers } from './answers'
import { Onboarding } from './Onboarding'
import { Welcome } from './Welcome'

type Screen = 'welcome' | 'onboarding' | 'garden'

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS)

  return (
    <main className="app">
      {screen === 'welcome' && <Welcome onStart={() => setScreen('onboarding')} />}
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
      {screen === 'garden' && <Garden answers={answers} onEdit={() => setScreen('onboarding')} />}
      <footer className="footer">Not financial advice. These are illustrative assumptions.</footer>
    </main>
  )
}
