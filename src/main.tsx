import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.tsx'
import React from 'react'
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
