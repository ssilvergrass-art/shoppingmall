import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types/product'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { id: 0, name: '전체' },
  { id: 1, name: '전자기기' },
  { id: 2, name: '패션의류' },
  { id: 3, name: '뷰티' },
  { id: 4, name: '식품' },
  { id: 5, name: '스포츠' },
  { id: 6, name: '홈/리빙' },
]

export function ProductListSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (selectedCategory > 0) {
        query = query.eq('category_id', selectedCategory)
      }
      // 전체 선택 시에는 필터링하지 않음

      const { data, error } = await query

      if (error) {
        console.error('상품 조회 오류:', error)
        throw error
      }
      setProducts(data || [])
    } catch (error) {
      console.error('상품 조회 오류:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold">상품 목록</h2>

      {/* 카테고리 필터 */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((category) => (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className={cn(
              'transition-all',
              selectedCategory === category.id && 'bg-primary text-white',
            )}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* 상품 그리드 */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          상품이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image_url={product.image_url}
              stock={product.stock}
            />
          ))}
        </div>
      )}
    </section>
  )
}

