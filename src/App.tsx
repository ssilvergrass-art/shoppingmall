import { Routes, Route } from 'react-router-dom'
import { SignupPage } from './pages/SignupPage'
import { LoginPage } from './pages/LoginPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { HomePage } from './pages/HomePage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage'
import { CheckoutFailPage } from './pages/CheckoutFailPage'
import { AuthErrorHandler } from './components/AuthErrorHandler'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <>
      <AuthErrorHandler />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/checkout/fail" element={<CheckoutFailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Routes>
    </>
  )
}

export default App
