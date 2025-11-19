-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert categories
INSERT INTO categories (id, name) VALUES
  (1, '전자기기'),
  (2, '패션의류'),
  (3, '뷰티'),
  (4, '식품'),
  (5, '스포츠'),
  (6, '홈/리빙')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category_id, stock) VALUES
  ('아이폰 15 Pro', '최신 애플 스마트폰', 1290000, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop', 1, 50),
  ('갤럭시 S24', '삼성 최신 스마트폰', 1150000, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop', 1, 30),
  ('맥북 프로', '고성능 노트북', 2500000, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop', 1, 20),
  ('에어팟 프로', '무선 이어폰', 350000, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop', 1, 100),
  ('나이키 운동화', '편안한 러닝화', 120000, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop', 5, 80),
  ('아디다스 후드티', '편안한 후드티', 89000, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop', 2, 60),
  ('지고트 코트', '세련된 코트', 250000, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop', 2, 25),
  ('샤넬 향수', '고급 향수', 180000, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop', 3, 40),
  ('에스티로더 파운데이션', '자연스러운 피부 표현', 65000, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=800&fit=crop', 3, 70),
  ('유기농 사과', '신선한 사과 1kg', 15000, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=800&fit=crop', 4, 200),
  ('한우 등심', '프리미엄 한우', 45000, 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800&h=800&fit=crop', 4, 50),
  ('요가 매트', '프리미엄 요가 매트', 45000, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop', 5, 90),
  ('덤벨 세트', '홈트레이닝용 덤벨', 120000, 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=800&fit=crop', 5, 35),
  ('이케아 소파', '편안한 소파', 450000, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop', 6, 15),
  ('무드등', '분위기 있는 무드등', 35000, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop', 6, 120),
  ('식탁 세트', '4인용 식탁', 320000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop', 6, 10)
ON CONFLICT DO NOTHING;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

