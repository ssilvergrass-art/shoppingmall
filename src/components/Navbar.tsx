import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, LogOut, UserCircle, Package, ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import type { Session } from '@supabase/supabase-js'

export function Navbar() {
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 초기 세션 확인
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setIsLoading(false)
    }

    getSession()

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      toast.success('로그아웃되었습니다.')
      navigate('/login')
    } catch (error: any) {
      console.error('Logout error:', error)
      toast.error('로그아웃에 실패했습니다.')
    }
  }

  const getInitials = (email: string | undefined) => {
    if (!email) return 'U'
    return email.charAt(0).toUpperCase()
  }

  if (isLoading) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* 좌측: 로고 */}
        <Link to="/" className="flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-xl font-bold">쇼핑몰</span>
        </Link>

        {/* 우측: 인증 상태에 따른 버튼 */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              {/* 장바구니 아이콘 + 뱃지 */}
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* 프로필 드롭다운 메뉴 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {getInitials(session.user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{session.user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      내정보
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      주문 내역
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/cart" className="flex items-center cursor-pointer">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      장바구니
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">회원가입</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

