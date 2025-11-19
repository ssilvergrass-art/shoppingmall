# AGENTS.md

이 문서는 이 프로젝트에서 작업하는 AI 에이전트를 위한 가이드라인입니다.

## 디자인 및 레이아웃 설계 규칙

### shadcn/ui 활용 원칙

1. **shadcn/ui 컴포넌트 우선 사용**
   - 새로운 UI 컴포넌트가 필요할 때는 먼저 shadcn/ui에서 제공하는 컴포넌트를 확인하고 활용합니다.
   - 커스텀 컴포넌트를 만들기 전에 shadcn/ui 컴포넌트로 구현 가능한지 검토합니다.

2. **디자인 시스템 준수**
   - 프로젝트는 **New York 스타일**을 사용합니다 (`components.json` 참조).
   - 모든 UI 컴포넌트는 일관된 디자인 시스템을 따릅니다.
   - Tailwind CSS를 통한 스타일링을 우선적으로 사용합니다.

3. **컴포넌트 구조**
   - shadcn/ui 컴포넌트는 `src/components/ui/` 디렉토리에 위치합니다.
   - 커스텀 컴포넌트는 `src/components/` 디렉토리에 위치합니다.
   - 유틸리티 함수는 `src/lib/utils.ts`에 위치합니다.

## shadcn/ui 컴포넌트 추가 방법

### 터미널 명령어를 통한 컴포넌트 추가

새로운 shadcn/ui 컴포넌트를 추가할 때는 **반드시 터미널 명령어를 사용**합니다.

#### 기본 명령어 형식

```bash
npx shadcn@latest add [component-name]
```

#### 예시

```bash
# Button 컴포넌트 추가
npx shadcn@latest add button

# Card 컴포넌트 추가
npx shadcn@latest add card

# Input 컴포넌트 추가
npx shadcn@latest add input

# 여러 컴포넌트 동시 추가
npx shadcn@latest add button card input
```

#### 주의사항

- **절대로 수동으로 컴포넌트 파일을 생성하지 않습니다.**
- 컴포넌트를 추가하기 전에 이미 설치되어 있는지 확인합니다.
- 컴포넌트 추가 후 필요한 경우 `src/components/ui/` 디렉토리에서 커스터마이징합니다.

## 프로젝트 구조

```
src/
├── components/
│   ├── ui/          # shadcn/ui 컴포넌트
│   └── ...          # 커스텀 컴포넌트
├── lib/
│   └── utils.ts      # 유틸리티 함수 (cn 함수 포함)
└── ...
```

## 작업 시 체크리스트

새로운 기능을 구현할 때:

1. ✅ 필요한 UI 컴포넌트가 shadcn/ui에 있는지 확인
2. ✅ 없다면 터미널 명령어로 컴포넌트 추가
3. ✅ shadcn/ui 컴포넌트를 활용하여 레이아웃 설계
4. ✅ 일관된 디자인 시스템 유지
5. ✅ Tailwind CSS를 통한 스타일링

## 참고 자료

- [shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [shadcn/ui 컴포넌트 목록](https://ui.shadcn.com/docs/components)
- 프로젝트 설정: `components.json` 파일 참조


