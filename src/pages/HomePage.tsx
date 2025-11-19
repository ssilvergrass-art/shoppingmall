import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { HeroSection } from '@/components/HeroSection'
import { CategorySection } from '@/components/CategorySection'
import { ProductListSection } from '@/components/ProductListSection'

export function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        navigate('/login', { replace: true })
      }
    }

    checkSession()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <CategorySection />
      <ProductListSection />
    </div>
  )
}

