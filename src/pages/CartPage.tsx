import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export function CartPage() {
  const navigate = useNavigate()
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart()

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price)
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('장바구니가 비어있습니다.')
      return
    }
    navigate('/checkout', { state: { fromCart: true } })
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="mb-4 h-24 w-24 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-bold">장바구니가 비어있습니다</h2>
          <p className="mb-6 text-muted-foreground">상품을 추가해보세요!</p>
          <Button asChild>
            <Link to="/">쇼핑하러 가기</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">장바구니</h1>
        <Button variant="outline" onClick={clearCart}>
          전체 삭제
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 장바구니 목록 */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.productId} className="p-4">
                <div className="flex gap-4">
                  {/* 상품 이미지 */}
                  <Link
                    to={`/products/${item.productId}`}
                    className="flex-shrink-0"
                  >
                    <div className="h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          이미지 없음
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* 상품 정보 */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="text-lg font-semibold hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      {item.product.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                          {item.product.description}
                        </p>
                      )}
                      <p className="mt-2 text-lg font-bold text-primary">
                        {formattedPrice(Number(item.product.price))}
                      </p>
                    </div>

                    {/* 수량 조절 및 삭제 */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold">
                          {formattedPrice(Number(item.product.price) * item.quantity)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {item.quantity >= item.product.stock && (
                      <p className="mt-2 text-xs text-red-500">
                        재고 부족 (최대 {item.product.stock}개)
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6">
            <h2 className="mb-4 text-xl font-bold">주문 요약</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">상품 수</span>
                <span className="font-semibold">{items.length}개</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">총 수량</span>
                <span className="font-semibold">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}개
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>총 금액</span>
                  <span className="text-primary">{formattedPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              size="lg"
              className="mt-6 w-full"
            >
              결제하기
            </Button>

            <Button
              variant="outline"
              asChild
              className="mt-2 w-full"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                쇼핑 계속하기
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

