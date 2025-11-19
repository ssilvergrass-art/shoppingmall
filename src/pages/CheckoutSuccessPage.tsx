import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Home } from 'lucide-react'
import { toast } from 'sonner'

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId')
    const paymentKeyParam = searchParams.get('paymentKey')

    if (orderIdParam && paymentKeyParam) {
      setOrderId(orderIdParam)
      updateOrderStatus(orderIdParam, paymentKeyParam)
    } else {
      toast.error('결제 정보를 찾을 수 없습니다.')
      navigate('/')
    }
  }, [searchParams, navigate])

  const updateOrderStatus = async (orderId: string, paymentKey: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_key: paymentKey,
        })
        .eq('id', orderId)

      if (error) throw error
    } catch (error) {
      console.error('주문 상태 업데이트 오류:', error)
      toast.error('주문 상태 업데이트에 실패했습니다.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="mx-auto max-w-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 className="mb-2 text-3xl font-bold">결제가 완료되었습니다!</h1>
        <p className="mb-6 text-muted-foreground">
          주문이 성공적으로 처리되었습니다.
        </p>

        {orderId && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
            <p className="text-sm text-muted-foreground">주문번호</p>
            <p className="font-mono font-semibold">{orderId}</p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로 가기
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/orders">주문 내역 보기</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}

