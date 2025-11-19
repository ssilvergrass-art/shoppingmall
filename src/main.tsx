import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Toaster } from '@/components/ui/sonner'
import { CartProvider } from '@/contexts/CartContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <Toaster />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
