import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { XCircle, Home, ArrowLeft } from 'lucide-react'

export function CheckoutFailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const errorCode = searchParams.get('code')
  const errorMessage = searchParams.get('message')
  const orderId = searchParams.get('orderId')

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="mx-auto max-w-2xl p-8 text-center">
        <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
        <h1 className="mb-2 text-3xl font-bold">결제에 실패했습니다</h1>
        <p className="mb-6 text-muted-foreground">
          {errorMessage || '결제 처리 중 오류가 발생했습니다.'}
        </p>

        {errorCode && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-left">
            <p className="text-sm text-muted-foreground">에러 코드</p>
            <p className="font-mono font-semibold text-red-600">{errorCode}</p>
          </div>
        )}

        {orderId && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
            <p className="text-sm text-muted-foreground">주문번호</p>
            <p className="font-mono font-semibold">{orderId}</p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate('/cart')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            장바구니로 돌아가기
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로 가기
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}

