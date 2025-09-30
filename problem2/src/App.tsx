import { useEffect } from 'react'
import CurrencySwapForm from './components/CurrencySwapForm'

function App() {
  useEffect(() => {
    // Start MSW in development
    if (import.meta.env.DEV) {
      import('./mocks/browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'bypass',
        })
      })
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <CurrencySwapForm />
    </div>
  )
}

export default App
