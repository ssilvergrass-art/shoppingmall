import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // 이메일 형식 검증
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 비밀번호 검증 (최소 8자, 대소문자 + 숫자 포함)
  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    return minLength && hasUpperCase && hasLowerCase && hasNumber
  }

  // 실시간 유효성 검증
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // 실시간 검증
    if (field === 'email' && value && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: '올바른 이메일 형식이 아닙니다.' }))
    } else if (field === 'password' && value && !validatePassword(value)) {
      setErrors((prev) => ({
        ...prev,
        password: '비밀번호는 최소 8자 이상이며, 대소문자와 숫자를 포함해야 합니다.',
      }))
    } else if (field === 'confirmPassword' && value && value !== formData.password) {
      setErrors((prev) => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // 전체 폼 검증
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.'
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.'
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = '비밀번호는 최소 8자 이상이며, 대소문자와 숫자를 포함해야 합니다.'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // Supabase Auth를 통한 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      })

      if (authError) {
        throw authError
      }

      if (authData.user) {
        // Profiles 테이블에 유저 정보 저장
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: authData.user.id,
          name: formData.name,
          email: formData.email,
        })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // 프로필 생성 실패해도 회원가입은 성공으로 처리
        }

        toast.success('회원가입이 완료되었습니다!')
        toast.info('이메일 인증이 필요합니다. 이메일을 확인해주세요.')

        // 폼 초기화
        setFormData({
          email: '',
          name: '',
          password: '',
          confirmPassword: '',
        })
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(error.message || '회원가입에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>새 계정을 만들어 시작하세요</CardDescription>
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
                onChange={(e) => handleChange('email', e.target.value)}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="최소 8자, 대소문자+숫자"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                '회원가입'
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                로그인
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


