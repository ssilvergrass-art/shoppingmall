# Supabase 마이그레이션 가이드

## 데이터베이스 설정

1. Supabase 대시보드에 로그인합니다.
2. 프로젝트의 SQL Editor로 이동합니다.
3. `migrations/001_create_products.sql` 파일의 내용을 복사하여 실행합니다.

또는 Supabase CLI를 사용하는 경우:

```bash
supabase db push
```

## 테이블 구조

### categories 테이블
- `id`: SERIAL PRIMARY KEY
- `name`: TEXT (카테고리명)
- `created_at`: TIMESTAMP

### products 테이블
- `id`: UUID PRIMARY KEY
- `name`: TEXT (상품명)
- `description`: TEXT (상품 설명)
- `price`: DECIMAL(10, 2) (가격)
- `image_url`: TEXT (이미지 URL)
- `category_id`: INTEGER (카테고리 ID, categories 테이블 참조)
- `stock`: INTEGER (재고 수량)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## 샘플 데이터

마이그레이션 파일에는 다음 카테고리와 상품들이 포함되어 있습니다:

- 카테고리: 전자기기, 패션의류, 뷰티, 식품, 스포츠, 홈/리빙
- 각 카테고리별 2-3개의 샘플 상품

