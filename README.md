# 쇼핑몰 프로젝트

React + TypeScript + Vite 기반의 쇼핑몰 애플리케이션입니다.

## 주요 기능

- 상품 목록 및 상세 페이지
- 장바구니 기능 (로컬스토리지 기반)
- 결제 기능 (Toss Payments v2 결제위젯)

## 환경 설정

### Toss Payments 결제위젯 연동 키 설정

결제 기능을 사용하려면 토스페이먼츠 개발자센터에서 결제위젯 연동 키를 발급받아야 합니다.

1. [토스페이먼츠 개발자센터](https://developers.tosspayments.com)에 접속
2. 로그인 후 **API 키** 메뉴로 이동
3. **결제위젯 연동 키**를 확인 (⚠️ API 개별 연동 키가 아닌 결제위젯 연동 키를 사용해야 합니다!)
4. 프로젝트 루트에 `.env` 파일을 생성하고 다음 내용 추가:

```env
VITE_TOSS_PAYMENTS_WIDGET_CLIENT_KEY=your_widget_client_key_here
```

또는 `src/pages/CheckoutPage.tsx` 파일에서 직접 키를 설정할 수 있습니다.

**주의**: 
- API 개별 연동 키는 사용할 수 없습니다. 반드시 결제위젯 연동 키를 사용해야 합니다.
- 테스트 환경에서는 테스트 결제위젯 연동 키를 사용하세요.

### Supabase 설정 (선택사항)

Supabase를 사용하는 경우 환경 변수를 설정할 수 있습니다:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

환경 변수가 없으면 기본값이 사용됩니다.

## 개발 시작

```bash
npm install
npm run dev
```

## 배포

### 빌드

프로덕션 빌드를 생성합니다:

```bash
npm run build
```

또는 프로덕션 모드로 빌드:

```bash
npm run build:prod
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 로컬에서 빌드 미리보기

빌드된 파일을 로컬에서 미리 확인:

```bash
npm run preview
```

### 배포 플랫폼별 가이드

#### Vercel 배포

1. [Vercel](https://vercel.com)에 프로젝트를 연결
2. 환경 변수 설정:
   - `VITE_TOSS_PAYMENTS_WIDGET_CLIENT_KEY`
   - `VITE_SUPABASE_URL` (선택사항)
   - `VITE_SUPABASE_ANON_KEY` (선택사항)
3. 빌드 명령어: `npm run build`
4. 출력 디렉토리: `dist`
5. 배포 완료

#### Netlify 배포

1. [Netlify](https://www.netlify.com)에 프로젝트를 연결
2. 빌드 설정:
   - 빌드 명령어: `npm run build`
   - 게시 디렉토리: `dist`
3. 환경 변수 설정 (Site settings > Environment variables)
4. 배포 완료

#### GitHub Pages 배포

1. `vite.config.ts`에 base 경로 설정 추가 (필요시)
2. GitHub Actions 워크플로우 설정 또는 수동 배포
3. 환경 변수는 GitHub Secrets에 설정

#### 기타 정적 호스팅

빌드된 `dist` 폴더의 내용을 정적 호스팅 서비스에 업로드하면 됩니다.

### 배포 전 체크리스트

- [ ] `.env` 파일에 필요한 환경 변수가 모두 설정되어 있는지 확인
- [ ] 프로덕션용 Toss Payments 결제위젯 연동 키로 변경 (테스트 키가 아닌 실제 키)
- [ ] Supabase URL 및 키가 올바르게 설정되어 있는지 확인
- [ ] `npm run build` 명령어로 빌드가 성공하는지 확인
- [ ] `npm run preview`로 빌드 결과를 미리 확인
- [ ] 모든 기능이 정상 작동하는지 테스트

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
