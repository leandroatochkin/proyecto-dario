import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import App from './App.jsx'
import './index.css'

const google_id = import.meta.env.VITE_GOOGLE_ID

console.warn = () => {};



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={google_id}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
