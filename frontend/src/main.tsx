import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider'
import { NotificationProvider } from './components/NotificationContext'
import NotificationContainer from './components/Notification'
import { LoadingProvider } from './components/LoadingContext'
import GlobalLoader from './components/GlobalLoader'

const root = document.getElementById('root') as HTMLElement
const tree = (
  <React.StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <LoadingProvider>
          <App />
          <NotificationContainer />
          <GlobalLoader />
        </LoadingProvider>
      </NotificationProvider>
    </ThemeProvider>
  </React.StrictMode>
)

if (root.dataset.prerendered === 'true') ReactDOM.hydrateRoot(root, tree)
else ReactDOM.createRoot(root).render(tree)
