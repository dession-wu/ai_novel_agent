import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider'
import { NotificationProvider } from './components/NotificationContext'
import NotificationContainer from './components/Notification'
import { LoadingProvider } from './components/LoadingContext'
import GlobalLoader from './components/GlobalLoader'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
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
  </React.StrictMode>,
)
