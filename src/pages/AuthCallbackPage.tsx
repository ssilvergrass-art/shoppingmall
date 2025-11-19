import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL 해시에서 에러 정보 확인
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const error = hashParams.get('error')
        const errorDescription = hashParams.get('error_description')

        if (error) {
          // 에러가 있는 경우
          let errorMessage = '인증에 실패했습니다.'
          
          if (error === 'access_denied') {
            if (errorDescription?.includes('expired')) {
              errorMessage = '이메일 인증 링크가 만료되었습니다. 다시 회원가입해주세요.'
            } else {
              errorMessage = '인증이 거부되었습니다.'
            }
          }

          toast.error(errorMessage)
          
          // 해시 제거
          window.history.replaceState(null, '', window.location.pathname)
          navigate('/login', { replace: true })
          return
        }

        // Supabase 세션 확인
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        if (session) {
          toast.success('인증이 완료되었습니다!')
          navigate('/', { replace: true })
        } else {
          // 세션이 없는 경우 로그인 페이지로 리다이렉트
          navigate('/login', { replace: true })
        }
      } catch (error: any) {
        console.error('Auth callback error:', error)
        toast.error('인증 처리 중 오류가 발생했습니다.')
        navigate('/login', { replace: true })
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">인증 처리 중</CardTitle>
          <CardDescription>잠시만 기다려주세요...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  )
}

