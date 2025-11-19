import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { supabase } from '@/lib/supabase'
import { TOSS_PAYMENTS_WIDGET_CLIENT_KEY, validateEnv } from '@/config/env'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Toss Payments 타입 선언
declare global {
  interface Window {
    TossPayments: any
  }
}

interface OrderFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  shippingDetailAddress: string
  shippingPostcode: string
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { items, totalPrice } = useCart()
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingName: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingDetailAddress: '',
    shippingPostcode: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isWidgetReady, setIsWidgetReady] = useState(false)
  const widgetsRef = useRef<any>(null)
  const paymentMethodRef = useRef<HTMLDivElement>(null)
  const agreementRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    // 장바구니가 비어있으면 홈으로 리다이렉트
    if (items.length === 0 && !location.state?.fromCart) {
      toast.error('장바구니가 비어있습니다.')
      navigate('/cart')
      return
    }

    // 환경 변수 검증
    if (!validateEnv()) {
      toast.error(
        '결제위젯 연동 키가 설정되지 않았습니다. .env 파일을 확인해주세요.',
      )
      return
    }

    // 이미 초기화되었으면 스킵 (React Strict Mode 대응)
    if (isInitializedRef.current) {
      return
    }

    // Toss Payments SDK 로드 및 초기화
    loadTossPaymentsSDK()
    isInitializedRef.current = true

    // cleanup 함수: 컴포넌트 언마운트 시 위젯 제거
    return () => {
      if (widgetsRef.current) {
        try {
          // 약관 위젯과 결제 수단 위젯 제거
          const agreementWidget = widgetsRef.current.agreementWidget
          const paymentMethodWidget = widgetsRef.current.paymentMethodWidget
          
          if (agreementWidget && typeof agreementWidget.destroy === 'function') {
            agreementWidget.destroy()
          }
          if (paymentMethodWidget && typeof paymentMethodWidget.destroy === 'function') {
            paymentMethodWidget.destroy()
          }
        } catch (error) {
          console.warn('위젯 정리 중 오류:', error)
        }
        widgetsRef.current = null
      }
      isInitializedRef.current = false
    }
  }, [])

  const loadTossPaymentsSDK = async () => {
    // SDK가 이미 로드되어 있는지 확인
    if (window.TossPayments) {
      initializeWidgets()
      return
    }

    // SDK 스크립트 로드
    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v2/standard'
    script.async = true
    script.onload = () => {
      initializeWidgets()
    }
    script.onerror = () => {
      toast.error('결제 시스템을 불러오는데 실패했습니다.')
    }
    document.head.appendChild(script)
  }

  const initializeWidgets = async () => {
    try {
      // 이미 위젯이 렌더링되어 있으면 스킵
      if (widgetsRef.current && isWidgetReady) {
        return
      }

      // 환경 변수에서 결제위젯 연동 키 확인
      if (!TOSS_PAYMENTS_WIDGET_CLIENT_KEY) {
        toast.error('결제위젯 연동 키가 설정되지 않았습니다.')
        return
      }

      // DOM 요소가 준비되었는지 확인
      const paymentMethodElement = document.getElementById('payment-method')
      const agreementElement = document.getElementById('agreement')

      if (!paymentMethodElement || !agreementElement) {
        console.error('결제 위젯 DOM 요소를 찾을 수 없습니다.')
        return
      }

      // 기존 위젯이 있으면 제거 (DOM 요소 비우기)
      if (widgetsRef.current) {
        try {
          const agreementWidget = widgetsRef.current.agreementWidget
          const paymentMethodWidget = widgetsRef.current.paymentMethodWidget
          
          if (agreementWidget && typeof agreementWidget.destroy === 'function') {
            await agreementWidget.destroy().catch(() => {})
          }
          if (paymentMethodWidget && typeof paymentMethodWidget.destroy === 'function') {
            await paymentMethodWidget.destroy().catch(() => {})
          }
        } catch (error) {
          // 에러 무시하고 계속 진행
        }
        
        // DOM 요소 비우기
        paymentMethodElement.innerHTML = ''
        agreementElement.innerHTML = ''
      }

      const { data: { session } } = await supabase.auth.getSession()
      // 비회원 결제를 위해 ANONYMOUS 사용
      const customerKey = session?.user?.id || window.TossPayments?.ANONYMOUS || `guest_${Date.now()}`

      // TossPayments 초기화
      const tossPayments = window.TossPayments(TOSS_PAYMENTS_WIDGET_CLIENT_KEY)

      // Widgets 생성 (비회원 결제)
      widgetsRef.current = tossPayments.widgets({
        customerKey: window.TossPayments?.ANONYMOUS || customerKey,
      })

      // 결제 금액 설정
      await widgetsRef.current.setAmount({
        currency: 'KRW',
        value: totalPrice,
      })

      // 결제수단 UI 렌더링 (별도로 처리하여 중복 에러 방지)
      // 결제수단 위젯이 이미 존재하는지 확인
      const existingPaymentMethod = document.querySelector('#payment-method > *')
      let paymentMethodWidget = null
      
      if (!existingPaymentMethod) {
        // 결제수단 위젯이 없을 때만 렌더링
        try {
          paymentMethodWidget = await widgetsRef.current.renderPaymentMethods({
            selector: '#payment-method',
            variantKey: 'DEFAULT',
          })
        } catch (paymentError: any) {
          // 결제수단 위젯이 이미 렌더링된 경우 에러 무시
          if (
            paymentError?.message?.includes('결제수단 위젯') ||
            paymentError?.message?.includes('하나의 결제수단 위젯만을 사용할 수 있어요')
          ) {
            console.warn('결제수단 위젯이 이미 존재합니다. 기존 위젯을 사용합니다.')
            paymentMethodWidget = { exists: true }
          } else {
            throw paymentError
          }
        }
      } else {
        console.warn('결제수단 위젯이 이미 DOM에 존재합니다. 기존 위젯을 사용합니다.')
        paymentMethodWidget = { exists: true }
      }

      // 약관 UI 렌더링 (별도로 처리하여 중복 에러 방지)
      // 약관 위젯이 이미 존재하는지 확인
      const existingAgreement = document.querySelector('#agreement > *')
      let agreementWidget = null
      
      if (!existingAgreement) {
        // 약관 위젯이 없을 때만 렌더링
        try {
          agreementWidget = await widgetsRef.current.renderAgreement({
            selector: '#agreement',
            variantKey: 'AGREEMENT',
          })
        } catch (agreementError: any) {
          // 약관 위젯이 이미 렌더링된 경우 에러 무시
          if (
            agreementError?.message?.includes('약관 위젯') ||
            agreementError?.message?.includes('하나의 약관 위젯만을 사용할 수 있어요')
          ) {
            console.warn('약관 위젯이 이미 존재합니다. 기존 위젯을 사용합니다.')
            agreementWidget = { exists: true }
          } else {
            throw agreementError
          }
        }
      } else {
        console.warn('약관 위젯이 이미 DOM에 존재합니다. 기존 위젯을 사용합니다.')
        agreementWidget = { exists: true }
      }

      // 위젯 인스턴스 저장 (나중에 destroy하기 위해)
      if (widgetsRef.current) {
        widgetsRef.current.paymentMethodWidget = paymentMethodWidget
        widgetsRef.current.agreementWidget = agreementWidget
      }

      setIsWidgetReady(true)
    } catch (error: any) {
      console.error('결제 위젯 초기화 오류:', error)
      const errorMessage =
        error?.message || '결제 위젯을 초기화하는데 실패했습니다.'
      
      if (errorMessage.includes('결제위젯 연동 키')) {
        toast.error(
          '결제위젯 연동 키가 올바르지 않습니다. 개발자센터에서 결제위젯 연동 키를 확인해주세요.',
        )
      } else if (
        errorMessage.includes('약관 위젯') ||
        errorMessage.includes('하나의 약관 위젯만을 사용할 수 있어요')
      ) {
        // 약관 위젯 중복 에러는 조용히 처리 (이미 렌더링된 경우)
        console.warn('약관 위젯이 이미 렌더링되어 있습니다.')
      } else if (
        errorMessage.includes('결제수단 위젯') ||
        errorMessage.includes('하나의 결제수단 위젯만을 사용할 수 있어요')
      ) {
        // 결제수단 위젯 중복 에러는 조용히 처리 (이미 렌더링된 경우)
        console.warn('결제수단 위젯이 이미 렌더링되어 있습니다.')
      } else {
        toast.error(errorMessage)
      }
    }
  }

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    if (!formData.customerName.trim()) {
      toast.error('주문자 이름을 입력해주세요.')
      return false
    }
    if (!formData.customerEmail.trim()) {
      toast.error('주문자 이메일을 입력해주세요.')
      return false
    }
    if (!formData.customerPhone.trim()) {
      toast.error('주문자 전화번호를 입력해주세요.')
      return false
    }
    if (!formData.shippingName.trim()) {
      toast.error('배송지 수령인을 입력해주세요.')
      return false
    }
    if (!formData.shippingPhone.trim()) {
      toast.error('배송지 전화번호를 입력해주세요.')
      return false
    }
    if (!formData.shippingAddress.trim()) {
      toast.error('배송지 주소를 입력해주세요.')
      return false
    }
    if (!formData.shippingDetailAddress.trim()) {
      toast.error('배송지 상세주소를 입력해주세요.')
      return false
    }
    return true
  }

  /**
   * UUID v4 형식의 주문 ID 생성
   * Supabase의 orders 테이블은 UUID 타입을 요구합니다.
   */
  const generateOrderId = (): string => {
    // UUID v4 형식 생성
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  const saveOrderToSupabase = async (orderId: string, paymentKey: string | null) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id || null

      // 주문 생성
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: userId,
          total_amount: totalPrice,
          status: paymentKey ? 'paid' : 'pending',
          payment_key: paymentKey,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 주문 상품들 추가
      const orderItems = items.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
        price: Number(item.product.price),
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      return orderData
    } catch (error) {
      console.error('주문 저장 오류:', error)
      throw error
    }
  }

  const handlePayment = async () => {
    if (!validateForm()) return
    if (!isWidgetReady || !widgetsRef.current) {
      toast.error('결제 위젯이 준비되지 않았습니다.')
      return
    }

    try {
      setIsProcessing(true)
      const orderId = generateOrderId()

      // 주문 정보를 먼저 저장 (pending 상태)
      await saveOrderToSupabase(orderId, null)

      // 결제 요청
      const orderName =
        items.length === 1
          ? items[0].product.name
          : `${items[0].product.name} 외 ${items.length - 1}건`

      await widgetsRef.current.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
        customerMobilePhone: formData.customerPhone,
      })
    } catch (error: any) {
      console.error('결제 요청 오류:', error)
      toast.error(error.message || '결제 요청에 실패했습니다.')
      setIsProcessing(false)
    }
  }

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/cart')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        장바구니로 돌아가기
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">결제하기</h1>
        <p className="mt-2 text-muted-foreground">주문 정보를 입력하고 결제를 진행해주세요.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 주문 정보 입력 폼 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 주문자 정보 */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold">주문자 정보</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">이름 *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="홍길동"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">이메일 *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="customerPhone">전화번호 *</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  placeholder="010-1234-5678"
                  required
                />
              </div>
            </div>
          </Card>

          {/* 배송지 정보 */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold">배송지 정보</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="shippingName">수령인 *</Label>
                <Input
                  id="shippingName"
                  value={formData.shippingName}
                  onChange={(e) => handleInputChange('shippingName', e.target.value)}
                  placeholder="홍길동"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingPhone">전화번호 *</Label>
                <Input
                  id="shippingPhone"
                  value={formData.shippingPhone}
                  onChange={(e) => handleInputChange('shippingPhone', e.target.value)}
                  placeholder="010-1234-5678"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingPostcode">우편번호</Label>
                <Input
                  id="shippingPostcode"
                  value={formData.shippingPostcode}
                  onChange={(e) => handleInputChange('shippingPostcode', e.target.value)}
                  placeholder="12345"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="shippingAddress">주소 *</Label>
                <Input
                  id="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                  placeholder="서울시 강남구 테헤란로 123"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="shippingDetailAddress">상세주소 *</Label>
                <Input
                  id="shippingDetailAddress"
                  value={formData.shippingDetailAddress}
                  onChange={(e) => handleInputChange('shippingDetailAddress', e.target.value)}
                  placeholder="123동 456호"
                  required
                />
              </div>
            </div>
          </Card>

          {/* 결제 수단 선택 */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold">결제 수단</h2>
            <div id="payment-method" ref={paymentMethodRef} />
            {!isWidgetReady && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">결제 위젯을 불러오는 중...</span>
              </div>
            )}
          </Card>

          {/* 이용약관 */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold">이용약관</h2>
            <div id="agreement" ref={agreementRef} />
          </Card>
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6">
            <h2 className="mb-4 text-xl font-bold">주문 요약</h2>
            <div className="space-y-4">
              {/* 주문 상품 목록 */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="line-clamp-1">{item.product.name}</span>
                    <span className="ml-2 font-semibold">
                      {formattedPrice(Number(item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>총 결제금액</span>
                  <span className="text-primary">{formattedPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={!isWidgetReady || isProcessing}
              size="lg"
              className="mt-6 w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  결제 진행 중...
                </>
              ) : (
                '결제하기'
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

