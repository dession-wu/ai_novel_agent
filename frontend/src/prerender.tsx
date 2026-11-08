import { Suspense } from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

export function renderLanding() {
  return renderToString(<><MemoryRouter initialEntries={['/']}><Suspense fallback={null}><LandingPage /></Suspense></MemoryRouter><div className="fixed top-4 right-4 z-50 flex flex-col gap-4 max-w-md w-full" /></>)
}
