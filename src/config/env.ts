/**
 * 환경 변수 타입 정의 및 검증
 */

interface Env {
  VITE_TOSS_PAYMENTS_WIDGET_CLIENT_KEY: string
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_ANON_KEY?: string
}

/**
 * 환경 변수 가져오기
 */
function getEnv(): Env {
  const tossClientKey = import.meta.env.VITE_TOSS_PAYMENTS_WIDGET_CLIENT_KEY

  if (!tossClientKey) {
    console.warn(
      '⚠️ VITE_TOSS_PAYMENTS_WIDGET_CLIENT_KEY가 설정되지 않았습니다.\n' +
      '프로젝트 루트에 .env 파일을 생성하고 VITE_TOSS_PAYMENTS_WIDGET_CLIENT_KEY를 설정해주세요.\n' +
      '.env.example 파일을 참고하세요.',
    )
  }

  return {
    VITE_TOSS_PAYMENTS_WIDGET_CLIENT_KEY: tossClientKey || '',
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
}

export const env = getEnv()

/**
 * Toss Payments 결제위젯 클라이언트 키
 * 
 * 토스페이먼츠 개발자센터에서 발급받은 결제위젯 연동 키를 사용하세요.
 * 주의: API 개별 연동 키가 아닌 결제위젯 연동 키를 사용해야 합니다!
 * 
 * @see https://developers.tosspayments.com
 */
export const TOSS_PAYMENTS_WIDGET_CLIENT_KEY = env.VITE_TOSS_PAYMENTS_WIDGET_CLIENT_KEY

/**
 * 환경 변수 검증
 */
export function validateEnv(): boolean {
  if (!TOSS_PAYMENTS_WIDGET_CLIENT_KEY) {
    console.error(
      '❌ 결제위젯 연동 키가 설정되지 않았습니다.\n' +
      '프로젝트 루트에 .env 파일을 생성하고 다음 내용을 추가하세요:\n\n' +
      'VITE_TOSS_PAYMENTS_WIDGET_CLIENT_KEY=your_widget_client_key_here\n\n' +
      '토스페이먼츠 개발자센터 > API 키 > 결제위젯 연동 키에서 확인할 수 있습니다.',
    )
    return false
  }

  // 테스트 키 형식 확인 (실제 운영에서는 제거 가능)
  if (TOSS_PAYMENTS_WIDGET_CLIENT_KEY.includes('test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq')) {
    console.warn(
      '⚠️ 기본 테스트 키가 사용되고 있습니다. 실제 결제위젯 연동 키로 변경해주세요.',
    )
  }

  return true
}

