import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function AuthErrorHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    // URL 해시에서 에러 정보 확인
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const error = hashParams.get('error')
      const errorDescription = hashParams.get('error_description')

      if (error) {
        let errorMessage = '인증에 실패했습니다.'
        
        if (error === 'access_denied') {
          if (errorDescription?.includes('expired')) {
            errorMessage = '이메일 인증 링크가 만료되었습니다. 다시 회원가입해주세요.'
          } else {
            errorMessage = '인증이 거부되었습니다.'
          }
        }

        toast.error(errorMessage)
        
        // 해시 제거하고 로그인 페이지로 리다이렉트
        window.history.replaceState(null, '', window.location.pathname)
        navigate('/login', { replace: true })
      }
    }
  }, [navigate])

  return null
}


