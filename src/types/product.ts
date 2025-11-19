export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_id: number | null
  stock: number
  category?: string | null
  created_at: string | null
}

export interface Category {
  id: number
  name: string
  created_at: string
}

export interface ProductWithCategory extends Omit<Product, 'category'> {
  category: Category
}

