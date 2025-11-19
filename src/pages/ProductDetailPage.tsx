import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import type { Product } from '@/types/product'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('상품 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, quantity)
    setQuantity(1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="h-96 animate-pulse rounded-lg bg-gray-200" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="mb-4 text-lg text-muted-foreground">상품을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
      </div>
    )
  }

  const formattedPrice = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(product.price)

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        뒤로가기
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 상품 이미지 */}
        <Card className="overflow-hidden">
          <div className="aspect-square w-full bg-gray-100">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                이미지 없음
              </div>
            )}
          </div>
        </Card>

        {/* 상품 정보 */}
        <div className="space-y-6">
          <div>
            <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">가격</p>
              <p className="text-3xl font-bold text-primary">{formattedPrice}</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-muted-foreground">재고</p>
              <p className={product.stock > 0 ? 'text-lg font-semibold' : 'text-lg font-semibold text-red-500'}>
                {product.stock > 0 ? `${product.stock}개` : '품절'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* 수량 선택 */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">수량:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                (최대 {product.stock}개)
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              size="lg"
              className="w-full"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock > 0 ? '장바구니 담기' : '품절'}
            </Button>
          </div>

          {product.stock === 0 && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              현재 재고가 없습니다. 입고 알림을 신청해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

