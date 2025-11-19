import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types/product'
import { toast } from 'sonner'

export interface CartItem {
  productId: string
  quantity: number
  product: Product
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'shoppingmall_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // 로컬스토리지에서 장바구니 로드
  useEffect(() => {
    loadCartFromStorage()
  }, [])

  // 장바구니 변경 시 로컬스토리지에 저장
  useEffect(() => {
    saveCartToStorage()
  }, [items])

  const loadCartFromStorage = async () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const cartData: CartItem[] = JSON.parse(stored)
        // 상품 정보가 있는지 확인하고 없으면 가져오기
        const itemsWithProducts = await Promise.all(
          cartData.map(async (item) => {
            if (item.product && item.product.id) {
              return item
            }
            // 상품 정보가 없으면 Supabase에서 가져오기
            try {
              const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', item.productId)
                .single()
              
              if (error || !data) {
                console.warn(`상품 ${item.productId}를 찾을 수 없습니다.`)
                return null
              }
              return { ...item, product: data }
            } catch (error) {
              console.error(`상품 ${item.productId} 로드 오류:`, error)
              return null
            }
          }),
        )
        setItems(itemsWithProducts.filter((item): item is CartItem => item !== null))
      }
    } catch (error) {
      console.error('장바구니 로드 오류:', error)
      setItems([])
    }
  }

  const saveCartToStorage = () => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('장바구니 저장 오류:', error)
    }
  }

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id)

      if (existingItem) {
        // 이미 있는 상품이면 수량 증가
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity > product.stock) {
          toast.error(`재고가 부족합니다. (최대 ${product.stock}개)`)
          return prevItems
        }
        return prevItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: newQuantity }
            : item,
        )
      } else {
        // 새 상품 추가
        if (quantity > product.stock) {
          toast.error(`재고가 부족합니다. (최대 ${product.stock}개)`)
          return prevItems
        }
        toast.success(`${product.name}이(가) 장바구니에 추가되었습니다.`)
        return [...prevItems, { productId: product.id, quantity, product }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => {
      const removedItem = prevItems.find((item) => item.productId === productId)
      if (removedItem) {
        toast.success(`${removedItem.product.name}이(가) 장바구니에서 제거되었습니다.`)
      }
      return prevItems.filter((item) => item.productId !== productId)
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) => {
      const item = prevItems.find((item) => item.productId === productId)
      if (item && quantity > item.product.stock) {
        toast.error(`재고가 부족합니다. (최대 ${item.product.stock}개)`)
        return prevItems
      }
      return prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      )
    })
  }

  const clearCart = () => {
    setItems([])
    toast.success('장바구니가 비워졌습니다.')
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

