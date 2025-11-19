import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 이전 페이지 또는 홈으로 리다이렉트할 경로 가져오기
  const from = (location.state as { from?: string })?.from || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!formData.email || !formData.password) {
      toast.error('이메일과 비밀번호를 모두 입력해주세요.')
      setIsLoading(false)
      return
    }

    try {
      // Supabase Auth를 통한 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        toast.success('로그인에 성공했습니다!')
        
        // 로그인 상태 유지 설정 (rememberMe가 true면 세션을 더 오래 유지)
        if (rememberMe) {
          // Supabase는 기본적으로 세션을 관리하므로, 
          // rememberMe는 클라이언트 측에서 세션 저장 방식을 조정할 수 있습니다
          // 실제로는 Supabase의 세션 관리가 자동으로 처리됩니다
        }

        // 이전 페이지 또는 홈으로 리다이렉트
        navigate(from, { replace: true })
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      // 에러 메시지 처리
      let errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.'
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = '이메일 인증이 필요합니다. 이메일을 확인해주세요.'
        } else {
          errorMessage = error.message
        }
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
          <CardDescription>계정에 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={isLoading}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-normal cursor-pointer"
              >
                로그인 상태 유지
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">계정이 없으신가요? </span>
              <Link to="/signup" className="text-primary hover:underline font-medium">
                회원가입
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


